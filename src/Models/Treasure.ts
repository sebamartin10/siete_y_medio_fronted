export class Treasure{
    _chips100_amount : number;
    _chips250_amount : number;
    _chips1k_amount : number;
    _chips2k_amount : number;
    _chips5k_amount : number;
    _total : number;
    

    constructor(chips100_amount:number,chips250_amount:number,chips500_amount:number,chips1k_amount:number,chips5k_amount:number,total:number){
        this._chips100_amount = chips100_amount;
        this._chips250_amount = chips250_amount;
        this._chips1k_amount = chips500_amount;
        this._chips2k_amount = chips1k_amount;
        this._chips5k_amount = chips5k_amount;
        this._total=total;
    }
}
export default Treasure;