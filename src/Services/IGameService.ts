export interface IGameService {
    getPlayerRoleForGame(gameSessionID:string) : string;
}

export default IGameService;