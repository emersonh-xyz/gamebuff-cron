/**
 * Fetches a users previous league matches
 * @param PUUID - the puuid of the user
 */
export default async function getMatchIdList(PUUID: string) {
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

