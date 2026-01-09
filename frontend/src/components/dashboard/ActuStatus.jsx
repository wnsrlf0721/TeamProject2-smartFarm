import "./ActuStatus.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

export default function ActuStatus({ logs = [], current_sensor = {} }) {
  // 센서 키와 표시 이름 매핑
  const SENSORS = {
    fan: "Fan",
    pump: "Pump",
    blind: "Blind",
    humidifier: "Humidifier",
    heater: "Heater",
  };

  // 현재 센서값 기반 상태 계산
  function getState(sensor, value) {
    if (!value && value !== 0) return "normal";

    const min = sensor.min;
    const max = sensor.max;

    if (value < min) return "low";
    if (value > max) return "high";
    return "normal";
  }

  // 로그를 센서별로 그룹화 (최근 1개만)
  const groupedLogs = {};
  logs.forEach((log) => {
    const type = log.actuatorType?.toLowerCase();
    if (!groupedLogs[type]) groupedLogs[type] = log;
  });

  return (
    <div className="actu-wrapper">
      <h2 className="actu-title">Device Operations</h2>
      <div className="actu-swiper-mask">
        <Swiper
          className="actu-swiper"
          modules={[EffectCoverflow, Pagination]}
          effect="coverflow"
          grabCursor={true}
          loop={true}
          // loopedSlides={5}
          centeredSlides={true}
          slidesPerView={2}
          spaceBetween={-100}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 80,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
        >
          {Object.entries(SENSORS).map(([key, label]) => {
            const sensorValue = current_sensor[key];
            const sensorState = getState(current_sensor[key] || {}, sensorValue);
            const recentLog = groupedLogs[key];

            return (
              <SwiperSlide key={key}>
                <div className="actu-card" key={key}>
                  <div className="actu-header">
                    <span className="actu-label">{label}</span>

                    <span className={`actu-pill ${sensorState}`}>
                      {sensorState === "high" && "↑ High"}
                      {sensorState === "low" && "↓ Low"}
                      {sensorState === "normal" && "✓ Normal"}
                    </span>
                  </div>

                  <div className="actu-body">
                    {recentLog ? (
                      <div className="log-item">
                        <span className="log-action">{recentLog.action}</span>
                        <span className="log-device">{recentLog.actuatorType}</span>
                        <span className="log-time">{recentLog.createdAt}</span>
                      </div>
                    ) : (
                      <div className="log-empty">최근 작동 로그 없음</div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
