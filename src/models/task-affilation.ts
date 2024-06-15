import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class TaskAffilation extends Model {
    public id!: number;
    public userId!: number;
    public groupId!: number;
    public taskInfoId!: number;
}

TaskAffilation.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: false,
            primaryKey: true,
        },
        userGroupId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        taskInfoId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        }
    },
    {
        tableName: 'task_affilation',
        sequelize,
    }
);

export default TaskAffilation;