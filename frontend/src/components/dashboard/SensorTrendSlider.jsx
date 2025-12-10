import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { useRef } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SensorTrendChart from "./SensorTrendChart";
import "./SensorTrendSlider.css";

SwiperCore.use([Navigation, Pagination]);

export default function SensorTrendSlider({ charts = [] }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="trend-slider-container">
      {/* 좌측 화살표 버튼 */}
      <button ref={prevRef} className="trend-nav-btn prev-btn">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M15 4L7 12L15 20" />
        </svg>
      </button>

      {/* 우측 화살표 버튼 */}
      <button ref={nextRef} className="trend-nav-btn next-btn">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M9 4L17 12L9 20" />
        </svg>
      </button>

      {/* 실제 슬라이더 */}
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        spaceBetween={20}
        loop={true} // ✔ 루프 활성화
        loopAdditionalSlides={1}
        speed={700}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;

          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {charts.map((chart, idx) => (
          <SwiperSlide key={idx}>
            <SensorTrendChart title={chart.title} unit={chart.unit} data={chart.data} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
