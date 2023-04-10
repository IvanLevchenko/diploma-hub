import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "repository/get";

class RepositoryDoesNotExist extends HttpException {
  constructor(params) {
    const message = "Repository does not exist.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

export default { RepositoryDoesNotExist };
