import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class TaskAffilation extends Model {
    public id!: number;
    public userId!: number;
    public groupId!: number;
    public taskId!: number;
    public startDate!: Date;
    public endDate!: Date;
    public status!: string;
    public priority!: number;
    public assignedBy!: number;
    public comments!: string;
}

TaskAffilation.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: false,
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
            type: DataTypes.INTEGER.UNSIGNED,
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
        tableName: 'task_affilation',
        sequelize,
    }
);

export default TaskAffilation;