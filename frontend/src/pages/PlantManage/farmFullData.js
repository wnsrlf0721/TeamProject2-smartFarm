// src/pages/PlantManage/farmFullData.js

const farmFullData = {
  farm: {
    farm_id: 3,
    device_id: 1,
    device_name: "스마트팜 A동",
    plant_name: "바질",
    plant_image: "/images/basil.jpg",
    status: "좋음",
    started_at: "2025-10-28",
    expected_harvest_at: "2025-12-20",
  },

  preset: {
    preset_id: 2,
    plant_type: "바질",
    preset_name: "바질 고성장 프리셋",
  },

  preset_step: {
    step_id: 7,
    growth_step: 1,
    growth_step_name: "생장기",
    period_days: 15,
    temp: { min: 22, max: 26 },
    humidity: { min: 50, max: 70 },
    lightPower: { min: 600, max: 1200 },
    soil_moisture: { min: 30, max: 45 },
    co2: { min: 300, max: 800 },
  },

  current_sensor: {
    temperature: 23.4,
    humidity: 56,
    lightPower: 780,
    soil_moisture: 34,
    co2: 420,
    logged_at: "2025-12-03 14:20",
  },

  sensor_history: {
    temperature: [
      ["시간", "온도"],
      ["10:00", 21],
      ["11:00", 22],
      ["12:00", 23],
      ["13:00", 24],
      ["14:00", 23],
    ],
    humidity: [
      ["시간", "습도"],
      ["10:00", 55],
      ["11:00", 57],
      ["12:00", 60],
    ],
    lightPower: [
      ["시간", "조도"],
      ["10:00", 800],
      ["11:00", 780],
      ["12:00", 750],
    ],
  },

  timelapse: [
    { url: "/timelapse/farm3-1.jpg", created_at: "2025-12-01" },
    { url: "/timelapse/farm3-2.jpg", created_at: "2025-12-02" },
  ],

  actuator_log: {
    lastWateringAt: "2025-11-27 09:20:02",
    last_action: "auto_on",
    actuator_type: "water_pump",
    current_value: 21.0,
  },

  alarms: [
    {
      alarm_type: "step_changed",
      title: "새로운 성장 단계가 시작되었어요",
      message: "식물이 성장 단계 1에서 2로 변경되었습니다.",
    },
    {
      alarm_type: "sensor_low_light",
      title: "조도가 부족합니다",
      message: "조도값 90은 설정 기준보다 낮아요.",
    },
    {
      alarm_type: "anniversary",
      title: "식물을 심은 지 30일!",
      message: "바질이 자란 지 30일이 지났어요 🌱",
    },
  ],
};

export default farmFullData;
