import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class SubTask extends Model {
    public id!: string;
    public taskInfoId!: string;
    public title!: string;
    public description!: string;
    public status!: string;
    public assignedBy!: string;
}

SubTask.init(
    {
        id: {
            type: DataTypes.STRING,
            autoIncrement: false,
            primaryKey: true,
        },
        taskInfoId: {
            type: DataTypes.STRING,
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
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'sub_task',
        sequelize,
    }
);

export default SubTask;
