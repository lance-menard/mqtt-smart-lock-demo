import { commands } from "./commands";

const handleData = (data) => {
  const [commandString, ...args] = data.toString().trim().split(" ");

  const command = commands[commandString];

  if (command) {
    command.handle(...args);
  } else {
    console.log("Unknown command.  Type 'help' for a listing of commands.");
  }
};

export const initializeInput = () => {
  const stdin = process.openStdin();

  stdin.addListener("data", handleData);

  console.log("Accepting user input.  Type 'help' for a listing of commands.");
};
