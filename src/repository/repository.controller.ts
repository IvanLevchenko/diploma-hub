import { Controller, Post } from "@nestjs/common";

@Controller("repository")
export class RepositoryController {
  @Post("create")
  private async create() {}
}
