import chalk from "chalk";
import { getState, lock, unlock } from "../../state";
import { printHelp } from "./printHelp";

export const commands = {
  help: {
    description: "Prints available commands.",
    handle: printHelp,
  },
  quit: {
    description: "Exits the application.",
    handle: () => {
      console.log("Exiting.");
      process.exit(0);
    },
  },
  break: {
    description:
      '"Breaks" the smart lock, stopping heartbeats and subscriptions.',
    handle: () => {
      const state = getState();
      state.broken = true;
      console.log(chalk.red("Smashed lock with a hammer."));
    },
  },
  lock: {
    description: "Manually locks the door.",
    handle: async ({ client }) => {
      await lock({ client });
      console.log(chalk.yellow("Door has been manually locked with a key."));
    },
  },
  unlock: {
    description: "Manually unlocks the door.",
    handle: async ({ client }) => {
      await unlock({ client });
      console.log(chalk.yellow("Door has been manually unlocked with a key."));
    },
  },
  fix: {
    description:
      '"Fixes" the smart lock, resuming heartbeats and subscriptions.',
    handle: () => {
      const state = getState();
      state.broken = false;
      console.log(chalk.green("Locksmith called."));
    },
  },
};
