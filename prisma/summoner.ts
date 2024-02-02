import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

/**
 * Responsible for getting all summoners
 * @returns summoner
 */
export const getAllSummoners = async () => {
    const summoners = await prisma.summoner.findMany({})
    return summoners;
}

export const getSummoner = async (puuid: string) => {
    const summoner = await prisma.summoner.findFirst({
        where: {
            puuid: puuid
        }
    })

    return summoner
}

export const updateSummonerRecentMatchId = async (id: string, matchId: string) => {

    const summoner = await prisma.summoner.update({
        where: {
            id: id
        },
        data: {
            recentMatchId: matchId
        }
    })

    return summoner;


}
