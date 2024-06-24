import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class SubTask extends Model {
    public id!: number;
    public taskInfoId!: number;
    public title!: string;
    public description!: string;
    public status!: string;
    public assignedBy!: number;
}

SubTask.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: false,
            primaryKey: true,
        },
        taskInfoId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        title: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        assignedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        }
    },
    {
        tableName: 'sub_task',
        sequelize,
    }
);

export default SubTask;