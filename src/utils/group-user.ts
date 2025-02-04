import UserService from "../services/user";
import GroupUserService from "../services/group-user";

class GroupUserUtils {
  private userService = new UserService();
  private groupUserService = new GroupUserService();

  public getRole = async (groupId: string, token: string) => {
    const user = await this.userService.getUserByToken(token);
    const groupUser = (await this.groupUserService.getUser(
      groupId,
      user?.id as string
    )) as { role: string };
    return groupUser.role;
  };
}

export default GroupUserUtils;
