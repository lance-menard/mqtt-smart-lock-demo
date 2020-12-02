import chalk from "chalk";
import { config } from "../config";

const verbose = config.get("verbose");

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

  state.clients[clientId].status = "Ok";
  state.clients[clientId].lastHeartbeat = new Date();

  if (verbose) {
    console.log(`Received heartbeat from ${chalk.blue(clientId)}.`);
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
  // TODO: Set up interval to check for devices that haven't checked in for a while
};
