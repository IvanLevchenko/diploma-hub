import { HttpException, HttpStatus } from "@nestjs/common";

const useCase = "file/create";

class FileCreationFailed extends HttpException {
  constructor(params) {
    const message =
      "Something went wrong while working with repository, file have not been created.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

class FileRollbackFailed extends HttpException {
  constructor(params) {
    const message = "File has not been deleted after creation error.";
    const response = {
      useCase,
      message,
      statusCode: HttpStatus.BAD_REQUEST,
      params,
    };
    super(response, HttpStatus.BAD_REQUEST);
  }
}

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

class FileContainsPlagiarism extends HttpException {
  constructor(params) {
    const message = "File contains plagiarism so it was not uploaded.";
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
  FileCreationFailed,
  FileRollbackFailed,
  RepositoryDoesNotExist,
  FileContainsPlagiarism,
};
