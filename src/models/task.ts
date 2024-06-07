import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class Task extends Model {
    public id!: number;
    public task!: string;
    
}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: false,
            primaryKey: true,
        },
        task: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'task',
        sequelize,
    }
);

export default Task;