import aedesFactory from "aedes";
import { createServer } from "net";

const PORT = process.env.MQTT_PORT || 1883;

export const initializeBroker = async () => {
  const aedes = aedesFactory();
  const server = createServer(aedes.handle);

  server.listen(PORT, () =>
    console.log(`MQTT broker started on port ${PORT}.`)
  );

  return server;
};
