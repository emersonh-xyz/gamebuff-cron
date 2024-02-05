import { PrismaClient, Summoner } from '@prisma/client'
import { getAllSummoners, getSummoner, updateSummonerRecentMatchId } from "../../prisma/summoner.js"
import { createLeagueMatch } from "../../prisma/league-match.js"
import { Participant, getMatchIdList } from "../util/league.util.js"
import { getMatch } from "../util/league.util.js"
import { Webhook, MessageBuilder } from 'discord-webhook-node'


// Import Prisma Client
const prisma = new PrismaClient()
const hook = new Webhook(process.env.WEBHOOK_URL)

/**
 * Function responsible for comparing matches across each summoner
 * @param summoners[] - An array of summoners
 */

async function getUpdatedMatchesForSummoners(summoners: Summoner[]) {

    const updatedMatches = new Map<{ userId: string, puuid: string, gameName: string }, string[]>();

    console.log(`Starting match refresh for ${summoners.length} summoners...`)

    let i = 0;
    for (let summoner of summoners) {

        i++;
        console.log(`[${i}/${summoners.length}] Checking matches for summoner: ${summoner.name} `);
        const matchList = await getMatchIdList(summoner.puuid);

        // console.log(`[DEBUG] ${summoner.name}:\n[RECENT MATCH]: ${summoner.recentMatchId}\n[ALL] ${matchList}`)

        // Case where the first match is already the most recent one we have in storage
        if (matchList[0] === summoner.recentMatchId) {
            console.log(`Nothing to update for: ${summoner.name}`);

            continue;
        }

        let newMatchArray = [];

        // Loop until match is found and then return up until that in   dex
        for (let i = 0; i < matchList.length; i++) {
            if (summoner.recentMatchId === matchList[i]) {
                console.log(`Found ${i} new matches for: ${summoner.name}`);

                // Push all the new matches to array
                for (let j = 0; j < i; j++) {
                    newMatchArray.push(matchList[j]);
                }

            }
        }

        // If the summoner has zero matches, assume all matches are new.
        if (newMatchArray.length === 0) {
            console.log('All matches are new, adding all...');

            for (let match of matchList) {
                newMatchArray.push(match);
            }
        }

        updatedMatches.set({ userId: summoner.userId, puuid: summoner.puuid, gameName: summoner.gameName }, newMatchArray);

        await updateSummonerRecentMatchId(summoner.id, matchList[0]);
    }

    return updatedMatches;
}

function findParticipant(participants: Participant[], puuid: string) {
    for (let participant of participants) {
        if (participant.puuid === puuid) {
            return participant;
        }
    }
}

async function postMatches(matchesMap: Map<{ userId: string, puuid: string, gameName: string }, string[]>) {

    // Itterate over map
    for await (let key of matchesMap.keys()) {
        const matches = matchesMap.get(key);

        const userId = key.userId;
        const puuid = key.puuid;
        const gameName = key.gameName;

        for (let match of matches) {

            // const create = await createLeagueMatch(userId, match, gameName, puuid);

            const matchData = await getMatch(match);
            const participant = findParticipant(matchData.info.participants, puuid);

            hook.setUsername('gamebuff');
            hook.setAvatar("https://cdn.discordapp.com/attachments/314848084733460482/1203071862675083344/image.png")

            const embed = new MessageBuilder()
                .setAuthor('gamebuff.gg')
                .setTitle(createTitleString(participant, gameName))
                .setURL(`https://gamebuff.gg/app/match-details/${match}`)
                .addField('Game Mode', `${matchData.info.gameMode}`, true)
                .addField('Kills', `${participant.kills}`, true)
                .addField('Deaths', `${participant.deaths}`, true)
                .addField('Assists', `${participant.assists}`, true)
                .setColor('#3B82F6')
                .setThumbnail(`${process.env.LEAGUE_ASSETS}/champion/${participant.championName}.png`)
                .setTimestamp();

            hook.send(embed);

        }

    }

}


function createTitleString(participant: Participant, name: string) {

    // TODO: Create 5 more variations of this string

    if (participant.win && participant.kills > 20) {
        return `🔥 ${name} is on fire with ${participant.kills} kills on ${participant.championName}!`
    }

    if (participant.win) {
        return `🔥 ${name} doesn't play on ${participant.championName}!`
    }

    return `${name} might want to put down the ${participant.championName} 😅`
}

async function main() {
    const summoners = await getAllSummoners();
    if (summoners) {
        const updatedMatches = await getUpdatedMatchesForSummoners(summoners);
        await postMatches(updatedMatches);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })