# mqtt-smart-lock-demo

Smart lock protocol demo using MQTT.

## Prerequisites

- Node.js (12 recommended)

## Development

Before development, install dependencies via `npm i`.

To start the application in "watch" mode (with automatic restarts on code changes), simply run `npm run watch:server` or `npm run watch:client`.

## Server Commands

### Lock/Unlcok

- To lock the door (as if from a smartphone), run `lock <clientId> <password>`.
- To unlock the door (as if from a smartphone), run `lock <clientId> <password>`.

### Passwords

- To change the primary admin password, run `changePass <new password> <current admin password>`
  - The server starts with a default admin password of `guest`.
- To set the temporary password, run `setTempPass <new temporary password> <admin password>`
- To clear the temporary password, run `clearTempPass <admin password>`

## Client Commands

### Manual Lock/Unlock

- To manually unlock the door with a key run `manual_unlock`.
- To manually lock the door with a key run `manual_lock`.
