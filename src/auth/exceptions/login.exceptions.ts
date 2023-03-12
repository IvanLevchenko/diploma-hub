import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "auth/login";

class UserDoesNotExist extends HttpException {
  constructor(params) {
    const message = "User with provided email is does not exists.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

class UserAuthorizationFailed extends HttpException {
  constructor() {
    const message = "Credentials are incorrect.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.UNAUTHORIZED,
    };
    super(response, HttpStatus.UNAUTHORIZED);
  }
}

export default { UserDoesNotExist, UserAuthorizationFailed };
