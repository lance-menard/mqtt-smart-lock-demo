import chalk from "chalk";
import cuid from "cuid";
import { config } from "../config";

const heartbeatIntervalSeconds = config.get("heartbeatIntervalSeconds");
const verbose = config.get("verbose");

export const CLIENT_ID = process.argv[2] || cuid();

const state = {
  broken: false,
  locked: true,
  statusChanged: false,
};

export const getState = () => state;

const sendHeartbeat = async ({ client }) => {
  if (!state.broken) {
    if (verbose) {
      console.log("Publishing heartbeat...");
    }

    await client.publish(`device/heartbeat/${CLIENT_ID}`, "", {
      qos: 0,
    });

    if (state.statusChanged === true) {
      state.statusChanged = false;
      console.log(`Door is ${state.locked ? "locked" : "unlocked"}.`);
      await client.publish(
        `device/lockstate/${CLIENT_ID}`,
        state.locked.toString(),
        {
          qos: 1,
        }
      );
    }
  } else {
    if (verbose) {
      console.log("Skipping heartbeat (I'm broken!)");
    }
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

const sendLockStatus = async ({ client }) => {
  if (!state.broken) {
    await client.publish(
      `device/lockstate/${CLIENT_ID}`,
      state.locked.toString(),
      {
        qos: 1,
      }
    );

    console.log(
      `Publishing lock status ${chalk.green(
        state.locked ? "locked" : "unlocked"
      )} in response to command.`
    );
  }
};

export const initializeState = async ({ client }) => {
  await client.subscribeWithHandler(`device/command/status/${CLIENT_ID}`, () =>
    sendLockStatus({ client })
  );

  await registerClient({ client });

  // TODO: Implement MQTT subscriber to listen for lock & unlock commands
};
