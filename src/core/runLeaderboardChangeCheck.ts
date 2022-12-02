import CompletedTask from "../database/models/CompletedTask.model";
import Member from "../database/models/Member.model";
import Logger from "../util/Logger";
import getLeaderboardData from "./getLeaderboardData";
import sendWebhook from "./sendWebhook";

export default async function runLeaderboardChangeCheck() {
    try {
        Logger.info('Running leaderboard change check.')

        const leaderboardData = await getLeaderboardData(parseInt(process.env['LEADERBOARD_ID']!), parseInt(process.env['YEAR']!), process.env['AOC_SESSION']!);

        const leaderboardMembers = Object.values(leaderboardData.members);

        const savedMembers = await Member.findAll();

        // Detect left members
        savedMembers.filter(m => !leaderboardMembers.find(mem => m.id === mem.id)).forEach(member => {
            member.destroy();
            // TO DO ADD LOGGING
        });

        // Detect new members
        for await (const member of leaderboardMembers.filter(mem => !savedMembers.find(m => m.id === mem.id))) {
            await Member.create({
                id: member.id,
                leaderboardId: parseInt(process.env['LEADERBOARD_ID']!),
                lastCollectedLocalScore: member.local_score
            });

            for await (const [day, dayData] of Object.entries(member.completion_day_level)) {
                for (const [task] of Object.entries(dayData)) {
                    await CompletedTask.create({
                        memberId: member.id,
                        leaderboardId: parseInt(process.env['LEADERBOARD_ID']!),
                        day: parseInt(day),
                        task: parseInt(task)
                    });
                }
            }
            // TO DO ADD LOGGING
        }

        for (const member of leaderboardMembers) {
            const savedMemberData = savedMembers.find(m => m.id === member.id);
            if (!savedMemberData) continue;

            const localScoreChange = Math.abs(member.local_score - savedMemberData.lastCollectedLocalScore);
            const savedCompletedTasks = await CompletedTask.findAll({
                where: {
                    memberId: member.id
                }
            });

            const newlyCompletedTasks: {
                day: number;
                task: number;
                completedAt: Date;
            }[] = [];

            for await (const [day, dayData] of Object.entries(member.completion_day_level)) {
                for (const [task, taskData] of Object.entries(dayData)) {
                    if (!savedCompletedTasks.find(t => t.day === parseInt(day) && t.task === parseInt(task))) newlyCompletedTasks.push({
                        day: parseInt(day),
                        task: parseInt(task),
                        completedAt: new Date(taskData.get_star_ts * 1000)
                    })
                }
            }

            if (localScoreChange || newlyCompletedTasks.length !== 0) {
                await sendWebhook(process.env['WEBHOOK_URL']!, {
                    title: 'Member score update',
                    description: `**Member:** ${member.name}\n**Change:** +${localScoreChange}\n**Newly completed tasks:**\n${newlyCompletedTasks.length === 0 ? 'None' : newlyCompletedTasks.map(t => `Day ${t.day}, task ${t.task}`).join('\n')}`
                });
                break;
            }
        }

        Logger.info('Finished running leaderboard change check.')
    } catch(err) {
        Logger.error('An error occured!');
        console.error(err);
    }
}