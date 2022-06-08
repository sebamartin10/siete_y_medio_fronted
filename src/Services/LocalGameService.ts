import IGameService from './IGameService';
import IGameSessionRepository from '../Repositories/IGameSessionRepository';

export class LocalGameService implements IGameService{
    private _repository : IGameSessionRepository;
    constructor(private repo:IGameSessionRepository){
        this._repository = repo;
    } 
    getPlayerRoleForGame(gameSessionID: string): string {
        return "banker";
    }
}