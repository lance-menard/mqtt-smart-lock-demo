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
  },
  heartbeatIntervalSeconds: {
    doc: "The frequency at which to publish heartbeat messages.",
    default: 5,
    format: Number,
    env: "HEARTBEAT_INTERVAL",
  },
  verbose: {
    doc: "Whether to include verbose logging.",
    default: false,
    format: Boolean,
    env: "VERBOSE",
  },
});
