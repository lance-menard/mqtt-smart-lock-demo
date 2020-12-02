import { initializeBroker } from "../broker";
import { initializeClient } from "../../shared/client";
import { commands } from "../input";
import { initializeInput } from "../../shared/input";
import { initializeState } from "../state";
import { config } from "../../server/config";

const mqttOptions = config.get("mqtt");

export const main = async () => {
  console.log("Initializing gateway application...");

  await initializeBroker();
  const client = await initializeClient(mqttOptions);
  await initializeState({ client });
  await initializeInput({ services: { client }, commands });
};
