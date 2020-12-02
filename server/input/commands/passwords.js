import bcrypt from "bcrypt";
import { getState } from "../../state";
import chalk from "chalk";

const saltRounds = 10;

const hashPassword = async (password) => bcrypt.hash(password, saltRounds);

const comparePassword = async (password, hash) =>
  bcrypt.compare(password, hash);

export const verifyPassword = async (password) => {
  const state = getState();
  const { passwordHash } = state;
  return comparePassword(password, passwordHash);
};

export const verifyTemporaryPassword = async (password) => {
  const state = getState();
  const { temporaryPasswordHash } = state;

  if (!temporaryPasswordHash) {
    return false;
  }

  return comparePassword(password, temporaryPasswordHash);
};

export const changePassword = async (
  services,
  newPassword,
  currentPassword
) => {
  if (!newPassword) {
    console.error(chalk.red("New password is required."));
    return;
  }

  if (!currentPassword) {
    console.error(chalk.red("Current password is required."));
    return;
  }

  if ((await verifyPassword(currentPassword)) === false) {
    console.error(chalk.red("Current password does not match."));
    return;
  }

  const state = getState();
  state.passwordHash = await hashPassword(newPassword);

  console.log(chalk.green("Password changed."));
};

export const setTemporaryPassword = async (
  services,
  newTemporaryPassword,
  currentPassword
) => {
  if (!newTemporaryPassword) {
    console.error(chalk.red("New temporary password is required."));
    return;
  }

  if (!currentPassword) {
    console.error(chalk.red("Current password is required."));
    return;
  }

  if ((await verifyPassword(currentPassword)) === false) {
    console.error(chalk.red("Current password does not match."));
    return;
  }

  const state = getState();
  state.temporaryPasswordHash = await hashPassword(newTemporaryPassword);

  console.log(chalk.green("Temporary password set."));
};

export const clearTemporaryPassword = async (services, currentPassword) => {
  const state = getState();
  const { passwordHash } = state;

  if (!currentPassword) {
    console.error(chalk.red("Current password is required."));
    return;
  }

  if ((await verifyPassword(currentPassword)) === false) {
    console.error(chalk.red("Current password does not match."));
    return;
  }

  state.temporaryPasswordHash = null;

  console.log(chalk.green("Temporary password cleared."));
};
