import { User } from "../user.entity";

export type PublicUser = Omit<User, "password" | "refreshToken">;
