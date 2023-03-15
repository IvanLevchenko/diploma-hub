import { HttpException, HttpStatus } from "@nestjs/common";

class UnauthorizedRequest extends HttpException {
  constructor(params) {
    const message = "Unauthorized request.";
    const response = {
      message,
      statusCode: HttpStatus.UNAUTHORIZED,
      params,
    };
    super(response, HttpStatus.UNAUTHORIZED);
  }
}

export default { UnauthorizedRequest };
