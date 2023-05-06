import { AuthorizationResult } from "../../common/types/authorization-result";

export interface IsAuthorized {
  isAuthorized: boolean;
  tokens?: AuthorizationResult;
}
