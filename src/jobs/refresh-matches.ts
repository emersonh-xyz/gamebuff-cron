import { PrismaClient, Summoner } from '@prisma/client'
import { getAllSummoners, getSummoner } from "../../prisma/summoner.js"
import getMatchIdList from "../util/league.util.js"
import { Webhook } from 'discord-webhook-node'


// Import Prisma Client
const prisma = new PrismaClient()
const hook = new Webhook("https://discord.com/api/webhooks/1201532126244384930/YP_Dy9r0MsyuuzdPpsjj50sqMQbJ5yGm3_SbmgG8jUSgCCMvBh1MHrgnJNgN_i338wJd")
hook.setUsername('Gamebuff Match Refresher')


/**
 * Function responsible for comparing matches across each summoner
 * @param summoners[] - An array of summoners
 */

async function getUpdatedMatchesForSummoners(summoners: Summoner[]) {

    const updatedMatches = new Map<{ userId: string, puuid: string }, string[]>();

    console.log(`Starting match refresh for ${summoners.length} summoners...`)

    let i = 1;
    for (let summoner of summoners) {

        console.log(`[${i}/${summoners.length}] Checking matches for summoner: ${summoner.name} `);
        const matchList = await getMatchIdList(summoner.puuid);

        console.log(`[DEBUG] ${summoner.name}:\n[RECENT MATCH]: ${summoner.recentMatchId}\n[ALL] ${matchList}`)

        // Case where the first match is already the most recent one we have in storage
        if (matchList[0] === summoner.recentMatchId) {
            console.log(`Nothing to update for: ${summoner.name}`)
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
            newMatchArray.push(matchList);
        }

        updatedMatches.set({ userId: summoner.puuid, puuid: summoner.userId }, newMatchArray)

        i++;
    }

    return updatedMatches;
}

async function postMatches(matches) {
    const summoner = getSummoner(m)
}


async function main() {
    const summoners = await getAllSummoners();
    if (summoners) {
        // TODO: return new match list with summoners
        const updatedMatches = await getUpdatedMatchesForSummoners(summoners);
        // TODO: create separate function for updating users summoner via match list
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