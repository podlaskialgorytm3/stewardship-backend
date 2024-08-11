import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class GroupUserRequest extends Model {
    public id!: string;
    public userId!: string;
    public groupId!: string;
    public status!: string;
}

GroupUserRequest.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        groupId: {
            type: DataTypes.STRING,
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