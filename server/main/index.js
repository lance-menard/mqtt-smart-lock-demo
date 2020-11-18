import { initializeBroker } from "../broker";
import { initializeClient } from "../client";
import { initializeInput } from "../input";

export const main = async () => {
  console.log("Initializing gateway application...");

  await initializeBroker();
  await initializeClient();
  // TODO: Implement state tracking for connected locks
  // TODO: Implement MQTT subscriber to listen for heartbeats and yell when they stop
  await initializeInput();
};
