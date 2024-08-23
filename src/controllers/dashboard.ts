import UserController from "./user";

class DashboardController {
  token: string;
  userController: UserController;
  constructor({ token }) {
    this.token = token;
    this.userController = new UserController();
  }

  public getGroupsToUser = async () => {
    try {
      const userId = this.userController.getUserIdByToken(this.token);
    } catch (error) {
      return {
        message: "An error occurred while fetching groups: " + error,
        type: "error",
      };
    }
  };
}

export default DashboardController;
