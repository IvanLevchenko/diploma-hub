import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "group/addUsers";

class GroupDoesNotExist extends HttpException {
  constructor(params) {
    const message = "Group does not exist.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

export default { GroupDoesNotExist };
