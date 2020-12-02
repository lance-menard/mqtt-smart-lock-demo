import { getState } from "../../state";
import chalk from "chalk";
import { verifyPassword, verifyTemporaryPassword } from "./passwords";

// This chunk of validation is identical between lock and unlock commands.
const verifyArguments = async (clientId, password) => {
  const state = getState();

  if (!clientId) {
    console.error(chalk.red("Client ID is required."));
    return false;
  }

  if (!state.clients[clientId]) {
    console.error(chalk.red(`Client ID ${clientId} not recognized.`));
    return false;
  }

  if (!password) {
    console.error(chalk.red("Password is required."));
    return false;
  }

  if (await verifyTemporaryPassword(password)) {
    // Clear the temporary password when it's used.
    state.temporaryPasswordHash = null;
  } else if ((await verifyPassword(password)) === false) {
    console.error(chalk.red("Password is not recognized."));
    return false;
  }

  return true;
};

export const lock = async ({ client }, clientId, password) => {
  if (await verifyArguments(clientId, password)) {
    await client.publish(`device/command/lock/${clientId}`, "", {
      qos: 1,
    });

    console.error(
      `Command ${chalk.blue("lock")} issued to client ${chalk.blue(clientId)}.`
    );
  }
};

export const unlock = async ({ client }, clientId, password) => {
  if (await verifyArguments(clientId, password)) {
    await client.publish(`device/command/unlock/${clientId}`, "", {
      qos: 1,
    });

    console.error(
      `Command ${chalk.blue("unlock")} issued to client ${chalk.blue(
        clientId
      )}.`
    );
  }
};
