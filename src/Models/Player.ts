import Treasure from "./Treasure";

export class Player{
    name : string;
    treasure : Treasure;

    constructor(playerName:string,treasure:Treasure){
        this.name=playerName;
        this.treasure=treasure;
    }
}
export default Player;