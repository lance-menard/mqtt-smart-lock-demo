import chalk from "chalk";
import { config } from "../../shared/config";

const verbose = config.get("verbose");
const heartbeatIntervalSeconds = config.get("heartbeatIntervalSeconds");

let state = {
  passwordHash: "$2b$10$cw2ZNUvzw46vig7HFlUXu.UmHH7WXwMDrLmOygV9mvZ.Y4BlpHKn6",
  temporaryPasswordHash: null,
  clients: {},
};

const handleRegisterClient = async ({ client }, topic) => {
  const clientId = topic.split("/")[2];

  state.clients[clientId] = {
    status: "Ok",
    lastHeartbeat: new Date(),
    locked: null,
  };

  // Since we don't know the status of the lock at initial registration, publish a command
  // to tell the client to publish its status.
  await client.publish(`device/command/status/${clientId}`, "", {
    qos: 1,
  });

  console.log(`Registered lock client ${chalk.blue(clientId)}.`);
};

const handleLockState = async (services, topic, message) => {
  const clientId = topic.split("/")[2];

  if (!state.clients[clientId]) {
    await handleRegisterClient(services, topic);
  }

  const locked = message.toString() === "true";
  state.clients[clientId].locked = locked;

  if (locked) {
    console.log(`${chalk.blue(clientId)}: Door is locked.`);
  } else {
    console.log(`${chalk.blue(clientId)}: Door is unlocked.`);
  }
};

const handleHeartbeat = async (services, topic, message) => {
  const clientId = topic.split("/")[2];

  if (!state.clients[clientId]) {
    await handleRegisterClient(services, topic);
  }

  if (state.clients[clientId].status === "Disconnected") {
    console.log(chalk.green(`Client ${chalk.blue(clientId)} has reconnected.`));
  }

  state.clients[clientId].status = "Ok";
  state.clients[clientId].lastHeartbeat = new Date();

  if (verbose) {
    console.log(`Received heartbeat from ${chalk.blue(clientId)}.`);
  }
};

const checkHeartbeat = () => {
  if (verbose) {
    console.log("Checking devices for missed heartbeats...");
  }

  // compare to value of the last heartbeat
  for (const [clientId, client] of Object.entries(state.clients)) {
    if (
      client.status != "Disconnected" &&
      Math.abs(new Date() - client.lastHeartbeat) >
        heartbeatIntervalSeconds * 1000 * 3
    ) {
      console.log(
        chalk.red(`Client ${chalk.blue(clientId)} has disconnected.`)
      );
      client.status = "Disconnected";
    }
  }
};

export const getState = () => state;

export const initializeState = async (services) => {
  const { client } = services;

  await client.subscribeWithHandler(
    "device/register/+",
    (topic) => handleRegisterClient(services, topic),
    {
      qos: 1,
    }
  );

  await client.subscribeWithHandler("device/heartbeat/+", (topic) =>
    handleHeartbeat(services, topic)
  );

  await client.subscribeWithHandler(
    "device/lockstate/+",
    (topic, message) => handleLockState(services, topic, message),
    {
      qos: 1,
    }
  );

  setInterval(() => checkHeartbeat(), heartbeatIntervalSeconds * 1000);
};
