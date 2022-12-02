import { Sequelize } from "sequelize";
import fs from "fs";
import { CronJob } from "cron";
import Logger from "./util/Logger";
import { config } from "dotenv";
config();

Logger.info("=================================");
Logger.info('AOC Webhook starting...');
Logger.info("=================================");

if (!fs.existsSync('./database.sqlite')) {
    Logger.warn('Database file not found, creating...');
    fs.writeFileSync('./database.sqlite', '');
    Logger.info('Database file created.');
}

export const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false
});

// Import modules after database exported
import initDatabaseData from "./core/initDatabaseData";
import runLeaderboardChangeCheck from "./core/runLeaderboardChangeCheck";
import Member from "./database/models/Member.model";

import "./database/models/CompletedTask.model";

Logger.info('Synchronizing database...');
db.sync().then(async () => {
    Logger.info('Synchronized database.');

    // If database is empty download initialise member data for detecting changes from
    const memberAmount = await Member.count();
    if (memberAmount === 0) await initDatabaseData();

    new CronJob(
        '*/15 * * * *', 
        runLeaderboardChangeCheck,
        null,
        true,
        'Europe/London'
    )
});

