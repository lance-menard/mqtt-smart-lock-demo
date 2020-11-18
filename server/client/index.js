import mqtt from "async-mqtt";

// TODO: Pull broker host and port from env

let client = null;

export const getClient = () => client;

export const initializeClient = async () => {
  client = await mqtt.connectAsync("mqtt://localhost:1883");
  console.log("MQTT client connected.");
  return client;
};
