import { DataTypes, Model } from "sequelize";
import { db } from "../..";

class CompletedTask extends Model {
    declare id: number;
    declare memberId: number;
    declare leaderboardId: number;
    declare day: number;
    declare task: number;
}

CompletedTask.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },

    memberId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    leaderboardId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    day: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    task: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize: db });

export default CompletedTask;