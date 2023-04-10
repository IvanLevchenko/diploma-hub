import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";

import { UserService } from "../user/user.service";
import { File } from "./file.entity";
import TokenHelper from "../helpers/token-helper";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private tokenHelper = new TokenHelper(this.jwtService, this.userService);

  async create(file: Express.Multer.File, token: string): Promise<File> {
    const userSession = this.tokenHelper.decodeToken(token);

    return await this.fileRepository.save({
      filename: file.filename,
      filepath: file.path,
      author: userSession.id,
    });
  }
}
