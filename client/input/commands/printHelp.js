import chalk from "chalk";
import { commands } from "./index";

export const printHelp = () => {
  console.log(
    chalk.yellow(
      `Smart Lock Gateway Client v${process.env.npm_package_version}`
    )
  );
  console.log("Available commands:");

  for (const [command, { description }] of Object.entries(commands)) {
    console.log(`\t${chalk.green(command)}\t${chalk.blue(description)}`);
  }
};
