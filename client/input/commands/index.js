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
