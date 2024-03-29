import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "file/get";

class FileDoesNotExist extends HttpException {
  constructor(params) {
    const message = "File does not exist.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

class TemporaryFileNotDeleted extends HttpException {
  constructor(params) {
    const message = "Temporary 'png' file has not been deleted.";
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
  FileDoesNotExist,
  TemporaryFileNotDeleted,
};
