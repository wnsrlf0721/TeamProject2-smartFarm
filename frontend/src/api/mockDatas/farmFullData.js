// src/api/mockDatas/farmFullData.js
const farmFullData = {
  user: {
    user_id: 1,
    login_id: "nova_user",
    name: "테스트 유저",
    email: "test@nova.com",
    phone_number: "010-1234-5678",
    role: "USER",
    login_type: "normal",
    last_login_date: "2024-12-01 15:20:00",
  },

  nova: {
    nova_id: 1,
    user_id: 1,
    nova_serial_number: "NOVA-2301-ABCD",
  },

  farm: {
    farm_id: 1,
    farm_name: "바질 A",
    slot: 2,
    nova_id: 1,
    created_time: "2024-12-01 10:00:00",
    update_time: "2024-12-10 15:20:00",

    // 날짜
    started_at: "2024-12-01",
    expected_harvest_at: "2025-01-05",

    status: "Healthy",
    plant_type: "Basil",
    plant_nickname: "바지리",
  },

  preset: {
    preset_id: 10,
    plant_type: "Basil",
    preset_name: "허브 기본 성장",
    user_id: 0, // 0 = 추천 프리셋
  },

  preset_step: [
    {
      step_id: 101,
      preset_id: 10,
      growth_step: 0,
      period_days: 15,

      temp: { min: 18, max: 32 },
      humidity: { min: 40, max: 75 },
      light: { min: 200, max: 700 },
      co2: { min: 200, max: 800 },
      soil_moisture: { min: 30, max: 60 },
    },
    {
      step_id: 102,
      preset_id: 10,
      growth_step: 1,
      period_days: 10,

      temp: { min: 20, max: 30 },
      humidity: { min: 50, max: 64 },
      light: { min: 300, max: 600 },
      co2: { min: 200, max: 780 },
      soil_moisture: { min: 35, max: 80 },
    },
    {
      step_id: 103,
      preset_id: 10,
      growth_step: 2,
      period_days: 20,

      temp: { min: 20, max: 30 },
      humidity: { min: 50, max: 64 },
      light: { min: 300, max: 600 },
      co2: { min: 200, max: 780 },
      soil_moisture: { min: 35, max: 80 },
    },
    {
      step_id: 104,
      preset_id: 10,
      growth_step: 3,
      period_days: 15,

      temp: { min: 18, max: 32 },
      humidity: { min: 40, max: 75 },
      light: { min: 200, max: 700 },
      co2: { min: 200, max: 800 },
      soil_moisture: { min: 30, max: 60 },
    },
  ],

  sensor_log: [
    {
      log_id: 101,
      farm_id: 1,
      record_time: "2024-12-10 03:00:00",
      temp: 24,
      humid: 45,
      lightPower: 200,
      co2: 480,
      soil_moisture: 35,
    },
    {
      log_id: 102,
      farm_id: 1,
      record_time: "2024-12-10 06:00:00",
      temp: 25,
      humid: 47,
      lightPower: 250,
      co2: 500,
      soil_moisture: 37,
    },
    {
      log_id: 103,
      farm_id: 1,
      record_time: "2024-12-10 09:00:00",
      temp: 26,
      humid: 50,
      lightPower: 300,
      co2: 510,
      soil_moisture: 40,
    },
    {
      log_id: 104,
      farm_id: 1,
      record_time: "2024-12-10 12:00:00",
      temp: 27,
      humid: 55,
      lightPower: 450,
      co2: 520,
      soil_moisture: 42,
    },
    {
      log_id: 105,
      farm_id: 1,
      record_time: "2024-12-10 15:00:00",
      temp: 28,
      humid: 52,
      lightPower: 380,
      co2: 530,
      soil_moisture: 44,
    },
  ],

  current_sensor: {
    temperature: 27,
    humidity: 28,
    soil_moisture: 42,
    lightPower: 720,
    co2: 520,
    water_level: 50, // normal
    logged_at: "2024-12-10 15:19:00",
  },

  sensor_history: {
    temperature: [
      { x: "Aug", y: 200 },
      { x: "Sep", y: 350 },
      { x: "Oct", y: 600 },
      { x: "Nov", y: 420 },
      { x: "Dec", y: 370 },
      { x: "Jan", y: 540 },
    ],

    humidity_range: [12, 18, 10, 25, 40, 55, 60, 45, 30, 20, 15, 27, 50],
  },

  plant_alarm: [
    {
      p_alarm_id: 201,
      user_id: 1,
      farm_id: 1,
      step_id: 101,
      alarm_type: "preset",
      title: "습도 낮음",
      message: "현재 습도가 설정 프리셋 기준 이하입니다.",
      created_at: "2024-12-10 13:22:00",
      is_read: false,
      extra_data: {},
    },
    {
      p_alarm_id: 202,
      user_id: 1,
      farm_id: 1,
      alarm_type: "light",
      title: "조도 과다",
      message: "빛이 너무 강합니다.",
      created_at: "2024-12-09 20:10:00",
      is_read: false,
      extra_data: {},
    },
    {
      p_alarm_id: 203,
      user_id: 1,
      farm_id: 1,
      alarm_type: "water",
      title: "물 부족",
      message: "워터탱크 물이 부족합니다.",
      created_at: "2024-12-08 17:33:00",
      is_read: true,
      extra_data: {},
    },
  ],

  actuator_log: [
    {
      actuator_id: 4001,
      farm_id: 1,
      action: "auto_on", // 자동으로 켜짐
      sensor_type: "temperature", // 온도 감지로 인해 작동
      actuator_type: "fan", // 냉각 팬
      current_value: 31, // 당시 온도
      created_at: "2024-12-10 14:00:00",
    },
    {
      actuator_id: 4002,
      farm_id: 1,
      action: "manual_off", // 사용자가 직접 끔
      sensor_type: "humidity", // 습도 기준 장치
      actuator_type: "humidifier", // 가습기
      current_value: 39, // 당시 습도
      created_at: "2024-12-09 18:22:00",
    },
    {
      actuator_id: 4003,
      farm_id: 1,
      action: "auto_off", // 자동으로 꺼짐
      sensor_type: "light",
      actuator_type: "led", // LED 조명
      current_value: 450, // 조도
      created_at: "2024-12-09 07:15:00",
    },
    {
      actuator_id: 4004,
      farm_id: 1,
      action: "manual_on", // 사용자가 직접 켬
      sensor_type: "soil",
      actuator_type: "pump", // 워터펌프
      current_value: 22, // 토양수분
      created_at: "2024-12-08 10:12:00",
    },
    {
      actuator_id: 4005,
      farm_id: 1,
      action: "auto_off", // 자동으로 꺼짐
      sensor_type: "co2",
      actuator_type: "fan", // 팬
      current_value: 530, // 이산화탄소농도
      created_at: "2024-12-08 10:15:00",
    },
  ],
};

export default farmFullData;
