import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { User } from "../user/user.entity";
import { Group } from "./group.entity";
import {
  GroupAddUsersDto,
  GroupCreateDto,
  GroupGetDto,
  GroupListDto,
  GroupRemoveUsersDto,
} from "./dto";

import CreateExceptions from "./exceptions/create.exceptions";
import GetExceptions from "./exceptions/get.exceptions";
import AddUsersExceptions from "./exceptions/add-users.exceptions";
import RemoveUsersExceptions from "./exceptions/remove-users.exceptions";

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private groupRepository: Repository<Group>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async create(dtoIn: GroupCreateDto): Promise<Group> {
    const group = await this.groupRepository.findOneBy({ name: dtoIn.name });

    if (group) {
      throw new CreateExceptions.GroupIsAlreadyExists({ name: dtoIn.name });
    }

    return await this.groupRepository.save(dtoIn);
  }

  public async list(dtoIn: GroupListDto): Promise<Group[]> {
    return await this.groupRepository.find(dtoIn);
  }

  public async get(dtoIn: GroupGetDto): Promise<Group> {
    const group = await this.groupRepository.findOne({
      where: { id: dtoIn.id },
      relations: ["userList"],
      select: {
        userList: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    });

    if (!group) {
      throw new GetExceptions.GroupDoesNotExist({ id: dtoIn.id });
    }

    return group;
  }

  public async addUsers(dtoIn: GroupAddUsersDto): Promise<Group> {
    const group = await this.groupRepository.findOneBy({ id: dtoIn.groupId });

    if (!group) {
      throw new AddUsersExceptions.GroupDoesNotExist({ id: dtoIn.groupId });
    }

    const ids: string[] = [];
    dtoIn.userIdList.forEach((id) => {
      if (!ids.includes(id) && !group.userIdList.includes(id)) {
        ids.push(id);
      }
    });

    if (!ids.length) {
      return group;
    }

    return await this.manageGroupUsers(ids, dtoIn.groupId, "append");
  }

  public async removeUsers(dtoIn: GroupRemoveUsersDto): Promise<Group> {
    const group = await this.groupRepository.findOneBy({ id: dtoIn.groupId });

    if (!group) {
      throw new RemoveUsersExceptions.GroupDoesNotExist({ id: dtoIn.groupId });
    }

    return this.manageGroupUsers(dtoIn.userIdList, dtoIn.groupId, "remove");
  }

  private async manageGroupUsers(
    userIdList: string[],
    groupId: string,
    option: "remove" | "append",
  ): Promise<Group> {
    for await (const userId of userIdList) {
      await this.userRepository.update(
        { id: userId },
        { groupId: option === "append" ? groupId : null },
      );
    }

    const result = await this.groupRepository
      .createQueryBuilder()
      .update(Group)
      .set({
        userIdList: () => `array_${option}("userIdList", '${userIdList}')`,
      })
      .where("id = :id", { id: groupId })
      .returning("*")
      .execute();
    return result.raw[0];
  }
}
