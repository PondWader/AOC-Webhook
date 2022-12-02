import Member from "../database/models/Member.model";
import CompletedTask from "../database/models/CompletedTask.model";
import Logger from "../util/Logger";
import getLeaderboardData from "./getLeaderboardData";

export default async function initDatabaseData() {
    Logger.warn('Base data needs to be downloaded, downloading...');

    const leaderboardData = await getLeaderboardData(parseInt(process.env['LEADERBOARD_ID']!), parseInt(process.env['YEAR']!), process.env['AOC_SESSION']!);

    await Member.bulkCreate(Object.values(leaderboardData.members).map(member => {
        return {
            id: member.id,
            leaderboardId: parseInt(process.env['LEADERBOARD_ID']!),
            lastCollectedLocalScore: member.local_score
        }
    }));

    const completedTasks: any[] = [];

    Object.values(leaderboardData.members).forEach(member => {
        Object.entries(member.completion_day_level).forEach(([day, dayData]) => {
            completedTasks.push(...Object.entries(dayData).map(([task]) => {
                return {
                    memberId: member.id,
                    leaderboardId: parseInt(process.env['LEADERBOARD_ID']!),
                    day: parseInt(day),
                    task: parseInt(task)
                }
            }))
        })
    })

    await CompletedTask.bulkCreate(completedTasks);

    Logger.info('Base data succesfully downloaded and saved.');
}