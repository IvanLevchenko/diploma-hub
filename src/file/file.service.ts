import { Injectable, StreamableFile } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository as TypeOrmRepository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import * as path from "path";
import * as fs from "fs";
import * as process from "process";

import { Repository } from "../repository/repository.entity";
import { UserService } from "../user/user.service";
import { File } from "./file.entity";
import TokenHelper from "../helpers/token-helper";
import RunScriptHelper from "../helpers/run-script-helper";
import { FileCreateDto, FileDeleteDto, FileGetDto, FileListDto } from "./dto";

import CreateExceptions from "./exceptions/create.exceptions";
import GetExceptions from "./exceptions/get.exceptions";
import DeleteExceptions from "./exceptions/delete.exceptions";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: TypeOrmRepository<File>,
    @InjectRepository(Repository)
    private repositoryRepository: TypeOrmRepository<Repository>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private tokenHelper = new TokenHelper(this.jwtService, this.userService);

  public async create(
    dtoIn: FileCreateDto,
    file: Express.Multer.File,
    token: string,
  ): Promise<File> {
    const userSession = this.tokenHelper.decodeToken(token);

    const repository = await this.repositoryRepository.findOne({
      where: { id: dtoIn.repositoryId },
    });

    if (!repository) {
      this.deleteFileFromUploads(file.filename);

      throw new CreateExceptions.RepositoryDoesNotExist({
        id: dtoIn.repositoryId,
      });
    }

    const fileEntity = new File();
    fileEntity.filename = dtoIn.filename;
    fileEntity.filepath = file.path;
    fileEntity.repositoryId = dtoIn.repositoryId;
    fileEntity.authorId = userSession.id;

    let createdFile;
    try {
      createdFile = await this.fileRepository.save(fileEntity);
    } catch (e) {
      this.deleteFileFromUploads(file.filename);

      throw new CreateExceptions.FileCreationFailed({});
    }

    try {
      await this.addFileToRepository(createdFile.id, dtoIn.repositoryId);
    } catch (e) {
      await this.fileRepository.delete({ id: createdFile.id });

      throw new CreateExceptions.FileCreationFailed({});
    }

    const runScriptHelper = new RunScriptHelper();
    const separatedPath = fileEntity.filepath.split(path.sep);
    const storedFileName = separatedPath[separatedPath.length - 1];

    runScriptHelper.pdfPreviewPageToBase64(storedFileName, createdFile.id);

    return createdFile;
  }

  public async list(dtoIn: FileListDto = {}): Promise<File[]> {
    return await this.fileRepository.find({
      where: {
        repositoryId: dtoIn.repositoryId,
      },
      skip: dtoIn.pageInfo?.page,
      take: dtoIn.pageInfo?.pageSize,
    });
  }

  public async get(dtoIn: FileGetDto): Promise<StreamableFile> {
    const file = await this.fileRepository.findOne({
      where: { id: dtoIn.id },
    });

    if (!file) {
      throw new GetExceptions.FileDoesNotExist({ id: dtoIn.id });
    }

    if (dtoIn.isPreview === "true") {
      const tmpFilePath = `uploads/tmp/tmp-${file.id}.png`;
      const previewPageFilePath = path.join(
        `uploads/first-pages/page-${file.id}`,
      );
      const pathToPage = path.join(process.cwd(), previewPageFilePath);
      const buffer = fs.readFileSync(pathToPage);

      fs.writeFileSync(tmpFilePath, buffer.toString(), {
        encoding: "base64",
      });

      const readableStream = fs.createReadStream(tmpFilePath);

      process.nextTick(() => {
        fs.unlink(tmpFilePath, (e) => {
          if (e) {
            throw new GetExceptions.TemporaryFileNotDeleted({});
          }
        });
      });

      return new StreamableFile(readableStream, {
        type: "image/png",
      });
    }

    const readableStream = fs.createReadStream(
      path.join(process.cwd(), file.filepath),
    );

    return new StreamableFile(readableStream);
  }

  public async delete(dtoIn: FileDeleteDto): Promise<void> {
    const file = await this.fileRepository.findOneBy({ id: dtoIn.id });

    if (!file) {
      throw new DeleteExceptions.FileDoesNotExist({ id: dtoIn.id });
    }

    fs.unlink(path.join(process.cwd(), file.filepath), (e) => {
      if (e) {
        throw new DeleteExceptions.FileDeleteFailed({});
      }
    });

    await this.fileRepository.delete({ id: dtoIn.id });
  }

  private async addFileToRepository(
    fileId: string,
    repositoryId: string,
  ): Promise<void> {
    await this.repositoryRepository
      .createQueryBuilder()
      .update(Repository)
      .set({
        filesIdList: () => `array_append("filesIdList", '${fileId}')`,
      })
      .where("id = :id", { id: repositoryId })
      .execute();
  }

  private deleteFileFromUploads(filename: string): void {
    const uploadsFolder = path.resolve(__dirname, "..", "..", "uploads");
    fs.readdir(uploadsFolder, (e) => {
      if (e) {
        throw new CreateExceptions.FileRollbackFailed({});
      }
      const filepath = path.resolve(uploadsFolder, filename);
      fs.unlink(filepath, (e) => {
        if (e) {
          throw new CreateExceptions.FileRollbackFailed({});
        }
      });
    });
  }
}
