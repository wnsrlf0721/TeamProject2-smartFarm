export const ACTUATOR_RULES = {
  temperature: {
    normal: {
      devices: [],
      color: "#cfe8c8",
      label: "Temperature Normal",
    },
    high: {
      devices: ["fan", "led"],
      color: "#ff6b6b", // red
      label: "High Temp → Cooling Required",
    },
    low: {
      devices: ["fan"],
      color: "#4dabf7", // blue
      label: "Low Temp → Heating",
    },
  },

  humidity: {
    normal: {
      devices: [],
      color: "#cfe8c8",
      label: "Temperature Normal",
    },
    high: {
      devices: ["humidifier"],
      color: "#20c997",
      label: "Humidity Low → Humidifier ON",
    },
    low: {
      devices: [],
      color: "#adb5bd",
      label: "Humidity High",
    },
  },

  co2: {
    normal: {
      devices: [],
      color: "#cfe8c8",
      label: "Temperature Normal",
    },
    high: {
      devices: ["fan"],
      color: "#51cf66",
      label: "High CO₂ → Ventilation Required",
    },
    low: {
      devices: [],
      color: "#adb5bd",
      label: "CO₂ Normal",
    },
  },

  light: {
    normal: {
      devices: [],
      color: "#cfe8c8",
      label: "Temperature Normal",
    },
    high: {
      devices: ["blind_servo"],
      color: "#ffd43b",
      label: "Low Light → Blind Open",
    },
    low: {
      devices: ["led"],
      color: "#ffa94d",
      label: "High Light → LED OFF",
    },
  },

  soil: {
    normal: {
      devices: [],
      color: "#cfe8c8",
      label: "Temperature Normal",
    },
    high: {
      devices: ["water_pump"],
      color: "#74c0fc",
      label: "Low Soil Moisture → Pump ON",
    },
    low: {
      devices: [],
      color: "#adb5bd",
      label: "Soil Moisture Normal",
    },
  },

  water_level: {
    normal: {
      devices: [],
      color: "#cfe8c8",
      label: "Temperature Normal",
    },
    low: {
      devices: [],
      color: "#868e96",
      label: "Water Low → Manual Refill Required",
    },
    high: {
      devices: [],
      color: "#adb5bd",
      label: "Water Level OK",
    },
  },
};
