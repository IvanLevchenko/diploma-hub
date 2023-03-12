import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "auth/register";

class UserAlreadyExists extends HttpException {
  constructor(params) {
    const message = "User with provided email is already exists.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

export default { UserAlreadyExists };
