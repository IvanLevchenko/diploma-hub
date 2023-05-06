import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "auth/login";

class UserDoesNotExist extends HttpException {
  constructor(params) {
    const message = "User with provided email does not exist.";
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
  constructor(params) {
    const message = "Credentials are incorrect.";
    const response = {
      useCase,
      message,
      params,
      statusCode: HttpStatus.UNAUTHORIZED,
    };
    super(response, HttpStatus.UNAUTHORIZED);
  }
}

export default { UserDoesNotExist, UserAuthorizationFailed };
