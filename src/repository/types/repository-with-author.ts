import { Repository } from "../repository.entity";
import { PublicUser } from "../../user/types/public-user";

export type RepositoryWithAuthor = Omit<Repository, "author"> & {
  author: PublicUser;
};
