import chalk from "chalk";
import { getState } from "../../state";
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
  manual_lock: {
    description:
      'Door has been manually locked.',
      handle: ()=> {
        const state = getState();
        state.locked = true;
        state.statusChanged = true;
        console.log(chalk.yellow("Door has been manually locked with a key"));
      },
  },
  manual_unlock: {
    description:
      'Door has been manually unlocked.',
      handle: ()=> {
        const state = getState();
        state.locked = false;
        state.statusChanged = true;
        console.log(chalk.yellow("Door has been manually unlocked with a key"));
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
  // TODO: Implement manual lock and unlock commands
};
