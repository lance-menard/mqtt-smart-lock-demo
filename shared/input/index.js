import chalk from "chalk";
import serverline from "serverline";

const handleCommand = ({ services, commands }) => async (line) => {
  const [commandString, ...args] = line.split(" ");

  const command = commands[commandString];

  if (command) {
    await command.handle(services, ...args);
  } else {
    console.log("Unknown command.  Type 'help' for a listing of commands.");
  }
};

export const initializeInput = ({ services, commands }) => {
  serverline.init();
  serverline.setPrompt("> ");
  serverline.on("line", handleCommand({ services, commands }));

  console.log(
    chalk.bold("Accepting user input.  Type 'help' for a listing of commands.")
  );
};
