# mqtt-smart-lock-demo

Smart lock protocol demo using MQTT.

## Prerequisites

- Node.js (12 recommended)

## Development

Before development, install dependencies via `npm i`.

To start the application in "watch" mode (with automatic restarts on code changes), simply run `npm run watch:server` or `npm run watch:client`.

## To do:

- Implement client state and subscriptions for lock and unlock (Sarah)
- Implement client commands to simulate manual lock and unlock with a key (Sarah)
- Implement server commands for lock and unlock (Tom)
- Set up internal permanent & temporary password commands (set, clear, etc.) (Tom)
- Set up interval on server to look for lock clients that haven't checked in (Tom)

### Additional:

- Implement TLS as an option for the broker (Lance)
- Implement username/password auth for the broker (Lance)
- Other security options?
- Benchmarks
