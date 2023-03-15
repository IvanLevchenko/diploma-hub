import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "user/create";

class UserDoesNotExist extends HttpException {
  constructor(params) {
    const message = "User does not exist";
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
  UserDoesNotExist,
};
