import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../configs/connect';

class User extends Model {
    public id!: number;
    public name!: string;
    public img!: string;
    public email!: string;
    public password!: string;
    public accessToken!: string;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        img: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        accessToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: 'users',
        sequelize,
    }
);

export default User;