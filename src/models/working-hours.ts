import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class WorkingHours extends Model {
    public id!: string;
    public groupUserId!: string;
    public start!: Date;
    public end!: Date;
    public totalHours!: number;
}


WorkingHours.init(
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
        start: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        totalHours: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        tableName: 'working_hours',
        sequelize,
    }
);

export default WorkingHours;