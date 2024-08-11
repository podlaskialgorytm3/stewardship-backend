import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class TaskAffilation extends Model {
    public id!: string;
    public groupUserId!: string;
    public taskInfoId!: string;
}

TaskAffilation.init(
    {
        id: {
            type: DataTypes.STRING,
            autoIncrement: false,
            primaryKey: true,
        },
        groupUserId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        taskInfoId: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'task_affilation',
        sequelize,
    }
);

export default TaskAffilation;