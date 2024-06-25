import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class WorkingHours extends Model {
    public id!: number;
    public groupUserId!: number;
    public start!: Date;
    public end!: Date;
    public totalHorus!: number;
}


WorkingHours.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        groupUserId: {
            type: DataTypes.INTEGER.UNSIGNED,
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
        totalHorus: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: 'working_hours',
        sequelize,
    }
);

export default WorkingHours;