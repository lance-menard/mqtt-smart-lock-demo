import chalk from "chalk";
import cuid from "cuid";
import { config } from "../config";

const heartbeatIntervalSeconds = config.get("heartbeatIntervalSeconds");

export const CLIENT_ID = process.argv[2] || cuid();

const state = {
  broken: false,
  locked: true,
  statusChanged: false,
};

export const getState = () => state;

const sendHeartbeat = async ({ client }) => {
  if (!state.broken) {
    console.log("Publishing heartbeat...");
    if(state.locked && state.statusChanged == true){
      state.statusChanged = false;
      console.log("Door is locked.");
      await client.publish(`device/lockstate/${CLIENT_ID}`, "true", {
        locked: true,
        qos: 1,
      });
    }
    else if( state.statusChanged==true)
    {
      state.statusChanged = false;
      console.log("Door is unlocked.");
      await client.publish(`device/lockstate/${CLIENT_ID}`, "false", {
        locked: false,
        qos: 1,
      });
    }
    else{
    await client.publish(`device/heartbeat/${CLIENT_ID}`, `${getState().locked}`, {
      locked: getState().locked,
      qos: 0,
    });
    }
  } else {
    console.log("Skipping heartbeat (I'm broken!)");
  }
};

const registerClient = async ({ client }) => {
  await client.publish(`device/register/${CLIENT_ID}`, "", {
    locked: true,
    qos: 1,
  });

  setInterval(() => sendHeartbeat({ client }), heartbeatIntervalSeconds * 1000);

  console.log(`Lock client registered under ID '${chalk.blue(CLIENT_ID)}'.`);
};

export const initializeState = async ({ client }) => {
  await registerClient({ client });
  // TODO: Implement MQTT subscriber to listen for lock & unlock commands
};
