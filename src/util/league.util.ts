/**
 * Fetches a users previous league matches
 * @param PUUID - the puuid of the user
 */
export async function getMatchIdList(PUUID: string) {
    const res = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID}/ids?start=0&count=10`, {
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com",
            "X-Riot-Token": process.env.RIOT_KEY ?? ""
        }
    });

    const data = await res.json() as string[]
    return data;
}

/**
 * Fetches a single LoL match through a matchId
 * @param matchId 
 * @returns match
 */
export async function getMatch(matchId: string) {
    const res = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
        method: 'GET',
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
            "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://developer.riotgames.com",
            "X-Riot-Token": process.env.RIOT_KEY ?? ""
        }
    })

    const data = await res.json() as Match

    return data;
}

export default { getMatch, getMatchIdList }

export interface Match {
    metadata: {
        dataVersion: string,
        matchId: string,
        participants: Participant[]
    }
    info: {
        gameCreation: number,
        gameDuration: number,
        gameEndTimestamp: number,
        gameId: number,
        gameMode: string,
        mapId: number,
        participants: Participant[],
        platformId: string,
        queueId: number
    }
}

export type Participant = {
    allInPings: number;
    assistMePings: number;
    assists: number;
    baitPings: number;
    baronKills: number;
    basicPings: number;
    bountyLevel: number;
    challenges: {
        soloKills: number;
    }
    champExperience: number;
    champLevel: number;
    championId: number;
    championName: string;
    championTransform: number;
    commandPings: number;
    consumablesPurchased: number;
    damageDealtToBuildings: number;
    damageDealtToObjectives: number;
    damageDealtToTurrets: number;
    damageSelfMitigated: number;
    dangerPings: number;
    deaths: number;
    detectorWardsPlaced: number;
    doubleKills: number;
    dragonKills: number;
    eligibleForProgression: boolean;
    enemyMissingPings: number;
    enemyVisionPings: number;
    firstBloodAssist: boolean;
    firstBloodKill: boolean;
    firstTowerAssist: boolean;
    firstTowerKill: boolean;
    gameEndedInEarlySurrender: boolean;
    gameEndedInSurrender: boolean;
    getBackPings: number;
    goldEarned: number;
    goldSpent: number;
    holdPings: number;
    individualPosition: string;
    inhibitorKills: number;
    inhibitorTakedowns: number;
    inhibitorsLost: number;
    item0: number;
    item1: number;
    item2: number;
    item3: number;
    item4: number;
    item5: number;
    item6: number;
    itemsPurchased: number;
    killingSprees: number;
    kills: number;
    lane: string;
    largestCriticalStrike: number;
    largestKillingSpree: number;
    largestMultiKill: number;
    longestTimeSpentLiving: number;
    magicDamageDealt: number;
    magicDamageDealtToChampions: number;
    magicDamageTaken: number;
    needVisionPings: number;
    neutralMinionsKilled: number;
    nexusKills: number;
    nexusLost: number;
    nexusTakedowns: number;
    objectivesStolen: number;
    objectivesStolenAssists: number;
    onMyWayPings: number;
    participantId: number;
    pentaKills: number;
    //perks coule be explored further (same as challenges)
    //data not included includes "styles" and "[[prototype]]"
    perks: {
        statPerks: {
            defence: number;
            flex: number;
            offence: number;
        }
    }
    physicalDamageDealt: number;
    physicalDamageDealtToChampions: number;
    physicalDamageTaken: number;
    placement: number;
    playerAugment1: number;
    playerAugment2: number;
    playerAugment3: number;
    playerAugment4: number;
    playerSubteamId: number;
    profileIcon: number;
    pushPings: number;
    puuid: string;
    quadraKills: number;
    riotIdName: string;
    riotIdTagline: string;
    role: string;
    sightWardsBoughtInGame: number;
    spell1Casts: number;
    spell2Casts: number;
    spell3Casts: number;
    spell4Casts: number;
    subteamPlacement: number;
    summoner1Casts: number;
    summoner1Id: number;
    summoner2Casts: number;
    summoner2Id: number;
    summonerId: number;
    summonerLevel: number;
    summonerName: string;
    teamEarlySurrendered: boolean;
    teamId: number;
    teamPosition: string;
    timeCCingOthers: number;
    timePlayed: number;
    totalAllyJungleMinionsKilled: number;
    totalDamageDealt: number;
    totalDamageDealtToChampions: number;
    totalDamageShieldedOnTeammates: number;
    totalDamageTaken: number;
    totalEnemyJungleMinionsKilled: number;
    totalHeal: number;
    totalHealsOnTeammates: number;
    totalMinionsKilled: number;
    totalTimeCCDealt: number;
    totalTimeSpentDead: number;
    totalUnitsHealed: number;
    tripleKills: number;
    trueDamageDealt: number;
    trueDamageDealtToChampions: number;
    trueDamageTaken: number;
    turretKills: number;
    turretTakedowns: number;
    turretsLost: number;
    unrealKills: number;
    visionClearedPings: number;
    visionScore: number;
    visionWardsBoughtInGame: number;
    wardsKilled: number;
    wardsPlaced: number;
    win: boolean;

}

