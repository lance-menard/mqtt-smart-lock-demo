import aedesFactory from "aedes";
import chalk from "chalk";
import { createServer } from "net";
import { config } from "../config";

const { host, port } = config.get("mqtt");

export const initializeBroker = async () => {
  const aedes = aedesFactory();
  const server = createServer(aedes.handle);
  server.listen(
    {
      host,
      port,
    },
    () =>
      console.log(
        `MQTT broker listening on host ${chalk.yellow(
          host
        )}, port ${chalk.yellow(port)}.`
      )
  );

  return server;
};
