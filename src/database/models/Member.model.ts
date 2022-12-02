import { DataTypes, Model } from "sequelize";
import { db } from "../..";

class Member extends Model {
    declare id: number;
    declare leaderboardId: number;
    declare lastCollectedLocalScore: number;
}

Member.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },

    leaderboardId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    lastCollectedLocalScore: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize: db });

export default Member;