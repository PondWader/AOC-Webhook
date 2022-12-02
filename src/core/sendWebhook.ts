import fetch from "node-fetch";

export default function sendWebhook(url: string, embed: {
    title?: string;
    description?: string;
    fields?: {
        name: string;
        value: string;
        inline?: boolean;
    }[];
    colour?: string;
}): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(url + '?wait=true', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                embeds: [{
                    type: 'rich',
                    title: embed.title,
                    description: embed.description,
                    footer: {
                        text: 'Advent of Code Webhook',
                        icon_url: 'https://adventofcode.com/favicon.png'
                    },
                    thumbnail: {
                        url: 'https://adventofcode.com/favicon.png'
                    },
                    fields: embed.fields,
                    color: embed.colour ? parseInt(embed.colour.slice(1), 16) : 5296968
                }]
            })
        }).then(res => res.json())
        .then(json => {
            if (json.id) resolve(json);
            else reject(json);
        }).catch(err => reject(err));
    })
}