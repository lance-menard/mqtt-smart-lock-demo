import convict from "convict";

export const config = convict({
  mqtt: {
    host: {
      doc: "The hostname on which the MQTT broker is listening.",
      default: "localhost",
      env: "MQTT_HOST",
    },
    port: {
      doc: "The port on which the MQTT broker is listening.",
      format: "port",
      default: 1883,
      env: "MQTT_PORT",
    },
    enableTls: {
      doc: "Whether to enable TLS encryption for communication.",
      format: Boolean,
      default: false,
      env: "MQTT_ENABLE_TLS",
    },
  },
  verbose: {
    doc: "Whether to include verbose logging.",
    default: false,
    format: Boolean,
    env: "VERBOSE",
  },
  heartbeatIntervalSeconds: {
    doc: "The frequency at which to publish heartbeat messages.",
    default: 5,
    format: Number,
    env: "CHECK_INTERVAL",
  },
});
