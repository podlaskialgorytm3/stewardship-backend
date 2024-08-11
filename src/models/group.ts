import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class Group extends Model {
    public id!: string;
    public name!: string;
    public category!: string;
}

Group.init(
    {
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'groups',
        sequelize,
    }
);

export default Group;
