import UserController from "../controllers/user"
import GroupUserController from "../controllers/group-user"

class GroupUserUtils {
    private userController = new UserController();
    private groupUserController = new GroupUserController();
    public getRole = async (groupId: string, token: string) => {
        const user = await this.userController.getUserByToken(token);
        const groupUser = await this.groupUserController.getUser(groupId, user?.id as number) as {role: string};
        return groupUser.role;

    }
}

export default GroupUserUtils;