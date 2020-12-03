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
  verbose: {
    doc: "Whether to include verbose logging.",
    default: false,
    format: Boolean,
    env: "VERBOSE",
  },
  checkIntervalSeconds: {
    doc: "The frequency at which to publish heartbeat messages.",
    default: 7,
    format: Number,
    env: "CHECK_INTERVAL",
  },
});
