import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "auth/isAuthorized";

class UserIsNotAuthorized extends HttpException {
  constructor(params) {
    const message = "User is not authorized.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

export default {
  UserIsNotAuthorized,
};
