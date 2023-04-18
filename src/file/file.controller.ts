import {
  Body,
  Controller,
  Get,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { FileCreateDto, FileListDto } from "./dto";
import { FileService } from "./file.service";
import { File } from "./file.entity";

import { AuthRolesGuard } from "../auth/auth-roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import UserRoles from "../common/enums/user-roles.enum";

@Controller("file")
export class FileController {
  constructor(private fileService: FileService) {}

  private static fileValidators: ParseFilePipe = new ParseFilePipe({
    validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1000 })],
  });

  @Post("create")
  @UseGuards(AuthRolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.TEACHER)
  @UseInterceptors(FileInterceptor("data"))
  private async create(
    @UploadedFile(FileController.fileValidators) file: Express.Multer.File,
    @Body() dtoIn: FileCreateDto,
    @Headers() headers,
  ): Promise<File> {
    return this.fileService.create(dtoIn, file, headers.authorization);
  }

  @Get("list")
  @UseGuards(AuthRolesGuard)
  @Roles(UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.STUDENT)
  private async list(dtoIn: FileListDto): Promise<File[]> {
    return this.fileService.list(dtoIn);
  }
}
