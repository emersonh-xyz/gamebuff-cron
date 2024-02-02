import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const createLeagueMatch = async (userId: string, matchId: string, gameName: string, puuid: string) => {

    const leagueMatch = await prisma.leagueMatch.create({
        data: {
            userId: userId,
            matchId: matchId,
            puuid: puuid,
            gameName: gameName
        }
    }).catch((e: Error) => {
        console.log(e);
        throw new Error("An unexpected error has occured while attempting to create a new workout")
    })

    return leagueMatch;

};


