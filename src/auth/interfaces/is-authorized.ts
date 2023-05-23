import { AuthorizationResult } from "../../common/types/authorization-result";
import { TokenPayload } from "../../common/interfaces/token-payload";

export interface IsAuthorized {
  isAuthorized: boolean;
  tokens?: AuthorizationResult;
  tokenPayload?: TokenPayload;
}
