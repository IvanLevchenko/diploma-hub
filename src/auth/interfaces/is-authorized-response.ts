import { IsAuthorized } from "./is-authorized";
import { TokenPayload } from "../../common/interfaces/token-payload";

export type IsAuthorizedResponse = Omit<IsAuthorized, "tokens"> & {
  token?: string;
  tokenPayload?: TokenPayload;
};
