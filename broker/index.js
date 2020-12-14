import aedesFactory from "aedes";
import chalk from "chalk";
import path from "path";
import net from "net";
import tls from "tls";
import { readFileSync } from "fs";
import { config } from "../shared/config";

const { port, enableTls, username, password } = config.get("mqtt");

const options = {
  key: readFileSync(path.join(__dirname, "privateKey.key")),
  cert: readFileSync(path.join(__dirname, "certificate.crt")),
};

const initializeBroker = async () => {
  const aedes = aedesFactory();

  if (username) {
    aedes.authenticate = function (client, user, pass, callback) {
      callback(null, user === username && pass.toString() === password);
    };
  }

  const serverCore = enableTls ? tls : net;
  const server = serverCore.createServer(options, aedes.handle);
  server.listen(
    {
      host: "0.0.0.0",
      port,
    },
    () =>
      console.log(
        `MQTT broker listening on ${chalk.yellow(
          `${enableTls ? "mqtt" : "mqtts"}://0.0.0.0:${port}`
        )}.`
      )
  );

  return server;
};

initializeBroker().catch(console.error);
