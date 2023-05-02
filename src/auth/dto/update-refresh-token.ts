import { IsString, IsUUID } from "class-validator";

export abstract class UpdateRefreshTokenDto {
  @IsUUID()
  id: string;

  @IsString()
  refreshToken: string;
}
