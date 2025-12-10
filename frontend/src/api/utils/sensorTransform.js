// src/api/utils/sensorTransform.js

// record_time 문자열을 Date 객체로 변환
function parseTime(t) {
  return new Date(t);
}

// 센서 로그를 프론트용 형태로 변환
export function transformSensorLog(sensor_log = []) {
  if (!sensor_log.length) {
    return {
      current_sensor: null,
      sensor_history: {
        temperature: [],
        humidity: [],
        soil: [],
        light: [],
        co2: [],
      },
    };
  }

  // 1) 시간순 정렬
  const sorted = [...sensor_log].sort(
    (a, b) => parseTime(a.record_time) - parseTime(b.record_time)
  );

  // 2) 최신값 (마지막 로그)
  const latest = sorted[sorted.length - 1];

  const current_sensor = {
    logged_at: latest.record_time,
    temperature: latest.temp,
    humidity: latest.humid,
    soil_moisture: latest.soil_moisture,
    lightPower: latest.lightPower,
    co2: latest.co2,
    water_level: latest.water_level ?? 40, // 임시값
  };

  // 3) 그래프용 12개 데이터 (12시간 or 최근 12개 로그)
  const last12 = sorted.slice(-12);

  const sensor_history = {
    temperature: last12.map((l) => ({
      x: l.record_time,
      y: l.temp,
    })),
    humidity: last12.map((l) => ({
      x: l.record_time,
      y: l.humid,
    })),
    soil: last12.map((l) => ({
      x: l.record_time,
      y: l.soil_moisture,
    })),
    light: last12.map((l) => ({
      x: l.record_time,
      y: l.lightPower,
    })),
    co2: last12.map((l) => ({
      x: l.record_time,
      y: l.co2,
    })),
  };

  return { current_sensor, sensor_history };
}
