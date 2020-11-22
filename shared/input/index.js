import chalk from "chalk";
import serverline from "serverline";

const handleCommand = (commands) => async (line) => {
  const [commandString, ...args] = line.split(" ");

  const command = commands[commandString];

  if (command) {
    await command.handle(...args);
  } else {
    console.log("Unknown command.  Type 'help' for a listing of commands.");
  }
};

export const initializeInput = ({ commands }) => {
  serverline.init();
  serverline.setPrompt("> ");
  serverline.on("line", handleCommand(commands));

  console.log(
    chalk.green("Accepting user input.  Type 'help' for a listing of commands.")
  );
};
