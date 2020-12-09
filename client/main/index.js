import { initializeClient } from "../../shared/client";
import { commands } from "../input";
import { initializeInput } from "../../shared/input";
import { initializeState } from "../state";
import { config } from "../../shared/config";

const mqttOptions = config.get("mqtt");

export const main = async () => {
  console.log("Initializing smart lock client application...");

  const client = await initializeClient(mqttOptions);
  await initializeState({ client });
  await initializeInput({ services: { client }, commands });
};
