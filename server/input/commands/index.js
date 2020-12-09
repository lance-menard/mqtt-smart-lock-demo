import { printHelp } from "./printHelp";
import {
  changePassword,
  setTemporaryPassword,
  clearTemporaryPassword,
} from "./passwords";
import { lock, unlock } from "./lock";
import { benchmark, stopBenchmark } from "./benchmarks";

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
  // Lock & unlock given the correct password (permanent or temporary)
  lock: {
    description:
      "Locks the device.\n\t\tUsage: lock <clientId> <currentPassword>",
    handle: lock,
  },
  unlock: {
    description:
      "Unlocks the device.\n\t\tUsage: unlock <clientId> <currentPassword>",
    handle: unlock,
  },
  // Activate or deactivate the temporary password (once used, the temporary password should be disabled automatically)
  changePass: {
    description:
      "Sets the password used when locking and unlocking the device.\n\t\t\tUsage: setPassword <newPassword> <currentPassword>",
    handle: changePassword,
  },
  setTempPass: {
    description:
      "Sets the temporaory passwordthat can be used to lock or unlock the device once.\n\t\t\tUsage: setTemporaryPassword <newTemporaryPassword> <currentPassword>",
    handle: setTemporaryPassword,
  },
  clearTempPass: {
    description:
      "Clears the temporary password that can be used to lock or unlock the device once.\n\t\t\tUsage: clearTemporaryPassword <currentPassword>",
    handle: clearTemporaryPassword,
  },
  // Benchmarks and testing.
  bench: {
    description:
      "Runs a command repeatedly, measuring latency over time.\n\t\t\tUsage: bench [rounds] [delay] [type] [clientId]\n\t\t\tExample: bench 100 100",
    handle: benchmark,
  },
  stop: {
    description: "Stops the current benchmark run.",
    handle: stopBenchmark,
  },
};
