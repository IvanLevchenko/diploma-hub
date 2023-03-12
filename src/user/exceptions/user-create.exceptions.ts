import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "user/create";

class UserDoesNotExist extends HttpException {
  constructor(params) {
    const message = "User does not exist";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.NOT_FOUND,
      params,
    };
    super(response, HttpStatus.NOT_FOUND);
  }
}

export default {
  UserDoesNotExist,
};
