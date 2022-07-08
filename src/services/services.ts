import { conflictError, notFoundError } from "../middlewares/errorHandleMiddleware.js";
import axios from "axios";
import { createFighter, findUserByUsername, updateStats } from "./../repositories/fightersRepository.js";

export async function checkUsers(firstUser:string, secondUser:string){
    const firstUserRepo = await getUserByName(firstUser);
    const secondUserRepo = await getUserByName(secondUser);

    const firstFighter = await getFighters(firstUser);
    const secondFighter = await getFighters(secondUser);
    
    const firstStarsCount = getUsersStarsCount(firstUserRepo);
    const secondStarsCount = getUsersStarsCount(secondUserRepo);

    return getBattleResult(
        firstFighter,
        secondFighter,
        firstStarsCount,
        secondStarsCount
    );

}

async function getUserByName(name:string){
    const {data}= await axios.get(`https://api.github.com/users/${name}/repos`);
    if(!data) return notFoundError();
    return data;
}

async function getFighters(username:string){
    const fighter = await findUserByUsername(username);
    if(!fighter) {
        const newFighter = await createFighter(username);
        return {id:newFighter.id, username, wins:0, losses:0, draw:0};
    }

    return fighter;
}

function getUsersStarsCount(userRepos: any[]){
    const starRepos = userRepos.map(repo => repo.stargazers_count);
    if(starRepos.length === 0) return 0;

    return starRepos.reduce((current:number, sum:number) => sum + current);
}

async function getBattleResult(firstFighter: any, secondFighter: any, firstStarsCount: number, secondStarsCount: number) {
    if (firstStarsCount > secondStarsCount) {
        await updateFightersStats(firstFighter.id, secondFighter.id);
        return {
            winner: firstFighter.username,
            loser: secondFighter.username,
            draw: false,
        };
    }
    if (secondStarsCount < firstStarsCount) {
        await updateFightersStats(secondFighter.id, firstFighter.id);
        return {
            winner: secondFighter.username,
            loser: firstFighter.username,
            draw: false,
        };
    }

    await updateDrawStats(firstFighter.id, secondFighter.id);
    return { winner: null, loser: null, draw: true };
}

async function  updateFightersStats(winnerId: number, loserId: number) {
    await updateStats(winnerId, "wins");
    await updateStats(loserId, "losses");
}

async function updateDrawStats(firstFighterId: number, secondFighterId: number) {
    await updateStats(firstFighterId, "draws");
    await updateStats(secondFighterId, "draws");
}