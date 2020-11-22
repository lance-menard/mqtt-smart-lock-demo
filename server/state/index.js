import chalk from "chalk";

let state = {
  clients: {},
};

const handleRegisterClient = (topic) => {
  const clientId = topic.split("/")[2];

  state.clients[clientId] = {
    status: "Ok",
    lastHeartbeat: new Date(),
  };

  console.log(`Registered lock client ${chalk.blue(clientId)}.`);
};

const handleHeartbeat = (topic) => {
  const clientId = topic.split("/")[2];

  state.clients[clientId] = {
    status: "Ok",
    lastHeartbeat: new Date(),
  };

  console.log(`Received heartbeat from ${chalk.blue(clientId)}.`);
};

export const getState = () => state;

export const initializeState = async ({ client }) => {
  await client.subscribeWithHandler("device/register/+", handleRegisterClient, {
    qos: 1,
  });

  await client.subscribeWithHandler("device/heartbeat/+", handleHeartbeat);

  // TODO: Set up interval to check for devices that haven't checked in for a while
};
