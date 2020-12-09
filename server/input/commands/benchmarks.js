import { getState } from "../../state";
import chalk from "chalk";
import _ from "lodash";

let roundsRemaining = 0;
let benchmarkInterval = null;
const stats = [];

const wrapSubscribe = async ({
  services,
  services: { client },
  clientId,
  bench,
}) => {
  let lastCommandAt = null;

  await client.subscribeWithHandler(
    `device/lockstate/${clientId}`,
    async () => {
      if (lastCommandAt) {
        const [seconds, nanoseconds] = process.hrtime(lastCommandAt);
        const elapsed = nanoseconds / 1e6;
        stats.push(elapsed);
        console.log(`\t${elapsed.toFixed(3)} ms`);

        lastCommandAt = null;
      }

      roundsRemaining = roundsRemaining - 1;

      if (roundsRemaining <= 0) {
        await stopBenchmark(services);
      }
    },
    {
      qos: 0,
    }
  );

  return () => {
    lastCommandAt = process.hrtime();
    return bench();
  };
};

const status = async ({ services, services: { client }, clientId }) =>
  wrapSubscribe({
    services,
    clientId,
    bench: () =>
      client.publish(`device/command/status/${clientId}`, "", {
        qos: 1,
      }),
  });

const cycle = async ({ services, services: { client }, clientId }) => {
  let lock = true;

  return wrapSubscribe({
    services,
    clientId,
    bench: () => {
      lock = !lock;
      return client.publish(
        `device/command/${lock ? "lock" : "unlock"}/${clientId}`,
        "",
        {
          qos: 1,
        }
      );
    },
  });
};

const BENCH_FUNCTIONS = {
  status,
  cycle,
};

export const stopBenchmark = () => {
  clearInterval(benchmarkInterval);
  benchmarkInterval = null;
  console.log(
    `Finished benchmark.
\tAverage RTT: ${chalk.yellow((_.sum(stats) / stats.length).toFixed(3))} ms
\tMax RTT: ${chalk.yellow(_.max(stats).toFixed(3))} ms`
  );

  stats.splice(0);
};

export const benchmark = async (
  services,
  rounds = 10,
  frequency = 1000,
  benchmarkType = "cycle",
  clientId = null
) => {
  if (benchmarkInterval) {
    stopBenchmark(services);
  }

  const makeBench = BENCH_FUNCTIONS[benchmarkType];

  if (!makeBench) {
    console.error(
      chalk.red(
        `Unknown benchmark type "${benchmarkType}".  Accepted benchmark types: ${Object.keys(
          BENCH_FUNCTIONS
        )}`
      )
    );
    return;
  }

  if (!clientId) {
    clientId = Object.keys(getState().clients)[0];
  }

  if (!clientId) {
    console.error(chalk.red(`No client found.`));
    return;
  }

  roundsRemaining = rounds;

  console.log(
    `Benchmarking:
\tClient: ${chalk.green(clientId)}
\tBenchmark: ${chalk.green(benchmarkType)}
\tFrequency: ${chalk.green(frequency)} ms
\tRounds: ${chalk.green(rounds)}
Type ${chalk.yellow("stop")} to stop.`
  );

  const benchFn = await makeBench({ services, clientId });

  benchmarkInterval = setInterval(benchFn, frequency);
};
