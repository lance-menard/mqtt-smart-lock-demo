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
  // TODO: Implement server commands:
  // Lock & unlock given the correct password (permanent or temporary)
  // Activate or deactivate the temporary password (once used, the temporary password should be disabled automatically)
};
