import chalk from "chalk";

let state = {
  clients: {},
};

const handleRegisterClient = (topic, message, options) => {
  const clientId = topic.split("/")[2];


  state.clients[clientId] = {
    status: "Ok",
    lastHeartbeat: new Date(),
    locked: true,
  };
  console.log(`Registered lock client ${chalk.blue(clientId)}.`);

  if(state.clients[clientId].locked == true)
  {
    console.log(`${chalk.blue(clientId)}: Door is locked.`);
  }
  else if(state.clients[clientId].locked = false)
  {
    console.log(`${chalk.blue(clientId)}: Door is unlocked.`);
  }
  else{
    console.log(`${chalk.blue(clientId)}: ${chalk.red('ERROR - DOOR STATUS UNKOWN')}`);
  }

};

const handleLockState = (topic, message, options) => {
  const clientId = topic.split("/")[2];

    state.clients[clientId] = {
      status: "Ok",
      lastHeartbeat: new Date(),
      locked: message,
    };
    if(message == "true")
    {
      console.log(`${chalk.red(clientId)}: Door is locked.`);
    }
    else{
      console.log(`${chalk.red(clientId)}: Door is unlocked.`);
    }
};

const handleHeartbeat = (topic, message, options) => {
  const clientId = topic.split("/")[2];
 
  state.clients[clientId] = {
    status: "Ok",
    lastHeartbeat: new Date(),
    locked: options.locked,
    };

    
  console.log(`Received heartbeat from ${chalk.blue(clientId)}.`);
};

export const getState = () => state;

export const initializeState = async ({ client }) => {
  await client.subscribeWithHandler("device/register/+", handleRegisterClient, {
    locked: true,
    qos: 1,
  });

  await client.subscribeWithHandler("device/heartbeat/+", handleHeartbeat);

  await client.subscribeWithHandler("device/lockstate/+", handleLockState);
  // TODO: Set up interval to check for devices that haven't checked in for a while
};
