import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class GroupUser extends Model {
    public id!: number;
    public userId!: number;
    public groupId!: number;
}

GroupUser.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        groupId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
    },
    {
        tableName: 'group_users',
        sequelize,
    }
);

export default GroupUser;