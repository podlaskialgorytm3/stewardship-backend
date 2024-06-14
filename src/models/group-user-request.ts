import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class GroupUserRequest extends Model {
    public id!: number;
    public userId!: number;
    public groupId!: number;
    public status!: string;
}

GroupUserRequest.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
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
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'group_user_requests',
        sequelize,
    }
);

export default GroupUserRequest;