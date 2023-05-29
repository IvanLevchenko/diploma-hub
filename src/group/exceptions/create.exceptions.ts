import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "group/create";

class GroupIsAlreadyExists extends HttpException {
  constructor(params) {
    const message = "Group with provided name is already exists.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

export default { GroupIsAlreadyExists };
