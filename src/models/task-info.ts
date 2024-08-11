import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class TaskInfo extends Model {
    public id!: string;
    public name!: number;
    public startDate!: Date;
    public endDate!: Date;
    public status!: string;
    public priority!: string;
    public assignedBy!: string;
    public comments!: string;
}

TaskInfo.init(
    {
        id: {
            type: DataTypes.STRING,
            autoIncrement: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
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
            type: DataTypes.STRING,
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