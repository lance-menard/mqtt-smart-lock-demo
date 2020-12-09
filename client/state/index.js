import chalk from "chalk";
import cuid from "cuid";
import { config } from "../../shared/config";

const heartbeatIntervalSeconds = config.get("heartbeatIntervalSeconds");
const verbose = config.get("verbose");

export const CLIENT_ID = process.argv[2] || cuid();

const state = {
  broken: false,
  locked: true,
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
      `Publishing lock status ${
        state.locked ? chalk.green("locked") : chalk.red("unlocked")
      }.`
    );
  }
};

export const lock = async ({ client }) => {
  if (!state.broken) {
    console.log(`${chalk.green("Locking")} door.`);
    state.locked = true;
    await sendLockStatus({ client });
  }
};

export const unlock = async ({ client }) => {
  if (!state.broken) {
    console.log(`${chalk.red("Unlocking")} door.`);
    state.locked = false;
    await sendLockStatus({ client });
  }
};

export const initializeState = async ({ client }) => {
  await client.subscribeWithHandler(`device/command/status/${CLIENT_ID}`, () =>
    sendLockStatus({ client })
  );

  await client.subscribeWithHandler(`device/command/lock/${CLIENT_ID}`, () =>
    lock({ client })
  );

  await client.subscribeWithHandler(`device/command/unlock/${CLIENT_ID}`, () =>
    unlock({ client })
  );

  await registerClient({ client });
};
