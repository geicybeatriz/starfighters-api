import { Request, Response} from "express";
import { conflictError, unprocessable } from "../middlewares/errorHandleMiddleware.js";
import { checkUsers } from "../services/services.js";


export async function postUserName(req:Request, res:Response){
    const { firstUser, secondUser } : {firstUser: string, secondUser: string} = req.body;
    
    if(!firstUser || !secondUser) return unprocessable();
    if(firstUser === secondUser) return conflictError();
    
    const battleResult = await checkUsers(firstUser, secondUser);

    res.status(201).send(battleResult);
}

// export async function getRanking(req:Request, res:Response){
    
// }