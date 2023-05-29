import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  IsUUID,
  Matches,
} from "class-validator";

import Constants from "../../constants";

export abstract class GroupAddUsersDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @Matches(Constants.uuidPattern, {
    each: true,
  })
  userIdList: string[];

  @IsUUID()
  groupId: string;
}
