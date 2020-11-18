import { commands } from "./index";

export const printHelp = () => {
  console.log(`Smart Lock Gateway Server v${process.env.npm_package_version}`);
  console.log("Available commands:");

  for (const [command, { description }] of Object.entries(commands)) {
    console.log(`${command}\t${description}`);
  }
};
