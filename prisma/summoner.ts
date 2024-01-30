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

