import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "user/create";

class UserAlreadyExists extends HttpException {
  constructor(params) {
    const message = "User with provided email is already exists";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.CONFLICT,
      params,
    };
    super(response, HttpStatus.CONFLICT);
  }
}

class UserDoesNotExist extends HttpException {
  constructor(params) {
    const message = "User with provided id does not exist";
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
  UserAlreadyExists,
  UserDoesNotExist,
};
