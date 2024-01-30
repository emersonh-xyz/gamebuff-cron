import { PrismaClient, Summoner } from '@prisma/client'
import { getAllSummoners } from "../../prisma/summoner.js"
import getMatchIdList from "../util/league.util.js"
import { Webhook } from 'discord-webhook-node'


// Import Prisma Client
const prisma = new PrismaClient()
const hook = new Webhook("https://discord.com/api/webhooks/1201532126244384930/YP_Dy9r0MsyuuzdPpsjj50sqMQbJ5yGm3_SbmgG8jUSgCCMvBh1MHrgnJNgN_i338wJd")
hook.setUsername('Gamebuff Match Refresher')

async function compareMatchesForEachSummoner(summoners: Summoner[]) {

    console.log(`Starting match refresh for ${summoners.length} summoners...`)

    let i = 1;
    for (let summoner of summoners) {
        console.log(`[${i}/${summoners.length}] Checking matches for summoner: ${summoner.name} `);

        const match = summoner.recentMatchId;
        const matchList = await getMatchIdList(summoner.puuid)

        // Case where the first match is already the most recent one we have in storage
        if (matchList[0] === match) {
            console.log(`Nothing to update for: ${summoner.name}`)
            continue;
        }

        let newMatchArray = [];

        // Loop until match is found and then return up until that in   dex
        for (let i = 0; i < matchList.length; i++) {
            if (match === matchList[i]) {
                console.log(`Found ${i} new matches for: ${summoner.name}`);
                hook.send(`Found ${i} new matches for: ${summoner.name}`);
                // Push all the new matches to array
                for (let j = 0; j < i; j++) {
                    newMatchArray.push(matchList[j]);
                    console.log(`Pushing match: ${matchList[j]}`);
                }
            }
        }

        i++;
    }
}

async function main() {
    const summoners = await getAllSummoners();
    if (summoners) {
        await compareMatchesForEachSummoner(summoners);;
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