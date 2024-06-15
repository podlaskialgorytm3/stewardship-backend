import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class TaskAffilation extends Model {
    public id!: number;
    public groupUserId!: number;
    public taskInfoId!: number;
}

TaskAffilation.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: false,
            primaryKey: true,
        },
        groupUserId: {
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