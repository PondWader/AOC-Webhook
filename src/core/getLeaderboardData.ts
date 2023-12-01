import fetch from "node-fetch";

export type LeaderboardData = {
    owner_id: number,
    event: number,

    members: {
        [key: string]: {
            last_star_ts: number,
            global_score: number,
            stars: number,
            local_score: number,
            name: string,
            id: number,
            completion_day_level: {
                [key: string]: {
                    "1": {
                        "star_index": number,
                        "get_star_ts": number
                    },
                    "2": {
                        "star_index": number,
                        "get_star_ts": number
                    }
                }
            }
        }
    }
}

export default function getLeaderboardData(leaderboardId: number, year: number, session: string): Promise<LeaderboardData> {
    return fetch(`https://adventofcode.com/${year}/leaderboard/private/view/${leaderboardId}.json`, {
        headers: {
            'cookie': `session=${session}`
        }
    }).then(res => {
        if (res.headers.get('content-type') === 'text/html') throw new Error('Received HTML response when expecting JSON, is your session cookie valid and up to date?');
        return res.json();
    })
}