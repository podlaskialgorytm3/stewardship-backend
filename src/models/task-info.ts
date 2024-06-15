import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class TaskInfo extends Model {
    public id!: number;
    public taskId!: number;
    public startDate!: Date;
    public endDate!: Date;
    public status!: string;
    public priority!: string;
    public assignedBy!: number;
    public comments!: string;
}

TaskInfo.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: false,
            primaryKey: true,
        },
        taskId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        priority: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        assignedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        comments: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: 'task_info',
        sequelize,
    }
);

export default TaskInfo;