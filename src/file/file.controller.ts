import {
  Body,
  Controller,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { FileCreateDto } from "./dto/file-create.dto";
import { FileService } from "./file.service";
import { File } from "./file.entity";

@Controller("file")
export class FileController {
  constructor(private fileService: FileService) {}

  private static fileValidators: ParseFilePipe = new ParseFilePipe({
    validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1000 })],
  });

  @Post("create")
  @UseInterceptors(FileInterceptor("data"))
  private async create(
    @UploadedFile(FileController.fileValidators) file: Express.Multer.File,
    @Body() dtoIn: FileCreateDto,
    @Headers() headers,
  ): Promise<File> {
    return this.fileService.create(file, headers.authorization);
  }
}
