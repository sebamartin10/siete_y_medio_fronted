export class Player{
    name : string;
    isBanker : boolean;

    constructor(playerName:string,banker:boolean){
        this.name=playerName;
        this.isBanker = banker;
    }
}