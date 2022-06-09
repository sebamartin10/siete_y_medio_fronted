import Player from "../Models/Player";

export interface IGameService {
    getPlayerRoleForGame(gameSessionID:string) : string;
    createPlayer(name:string) : Player
}

export default IGameService;