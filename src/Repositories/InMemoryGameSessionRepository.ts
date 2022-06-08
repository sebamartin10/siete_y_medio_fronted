import IGameSessionRepository from './IGameSessionRepository';

export class InMemoryGameSessionRepository implements IGameSessionRepository{
    
    public getCurrentTurn(): string{
        return "Player1";
        
    }
}