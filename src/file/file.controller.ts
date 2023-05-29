import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";

import {
  FileCreateDto,
  FileDeleteDto,
  FileGetDto,
  FileListDto,
  FileUpdateDto,
} from "./dto";
import { FileService } from "./file.service";
import { File } from "./file.entity";

import { AuthRolesGuard } from "../auth/auth-roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { UserRoles } from "../common/enums/user-roles.enum";

@Controller("file")
export class FileController {
  constructor(private fileService: FileService) {}

  private static fileValidators: ParseFilePipe = new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 1000 * 1000 }),
      new FileTypeValidator({ fileType: "pdf" }),
    ],
  });

  @Post("create")
  @UseGuards(AuthRolesGuard)
  @Roles(UserRoles.ALL)
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
  @Roles(UserRoles.ALL)
  private async list(@Query() dtoIn: FileListDto): Promise<File[]> {
    return this.fileService.list(dtoIn);
  }

  @Get("get")
  @UseGuards(AuthRolesGuard)
  @Roles(UserRoles.ALL)
  private async get(
    @Query() dtoIn: FileGetDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const stream = await this.fileService.get(dtoIn);

    res.set({
      "Content-Type": dtoIn.isPreview ? "image/png" : "application/pdf",
    });

    return stream;
  }

  @Delete("delete")
  @UseGuards(AuthRolesGuard)
  @Roles(UserRoles.ALL)
  private async delete(@Body() dtoIn: FileDeleteDto): Promise<void> {
    return this.fileService.delete(dtoIn);
  }

  @Patch("update")
  @UseGuards(AuthRolesGuard)
  @Roles(UserRoles.ALL)
  private async update(@Body() dtoIn: FileUpdateDto): Promise<File> {
    return this.fileService.update(dtoIn);
  }
}
