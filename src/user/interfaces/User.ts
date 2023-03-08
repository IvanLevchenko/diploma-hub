import UserRoles from "../../common/enums/user-roles.enum";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRoles[];
}

export { User };
export default User;
