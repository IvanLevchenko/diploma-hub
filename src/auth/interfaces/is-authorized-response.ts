import { IsAuthorized } from "./is-authorized";

export type IsAuthorizedResponse = Omit<IsAuthorized, "tokens"> & {
  token?: string;
};
