/* eslint-disable @typescript-eslint/no-unused-vars */
import Player from '../Models/Player';
import axios from 'axios';
import Treasure from '../Models/Treasure';

const LocalGameService = () => {
    
    function createPlayer(name: string): Player {
        let treasureCreated : Treasure = new Treasure(0,0,0,0,0,0);
        let playerCreated : Player = new Player("",treasureCreated);
        const player = {
            name : name
        }
        
        axios.post('http://localhost:3000/players', { player })
            .then(player_response => {
                console.log(player_response.data);
                const treasure = {
                    chips100_amount : 10,
                    chips250_amount : 5,
                    chips500_amount : 3,
                    chips1k_amount : 2,
                    chips5k_amount : 1,
                    total:10750,
                    player_id:player_response.data.player.id
                };
                playerCreated.name = player_response.data.player.name;
                console.log(treasure);
                axios.post('http://localhost:3000/treasures',{treasure})
                    .then(treasure_response =>{
                        let treasureReceived : Treasure = new Treasure(treasure_response.data.treasure.chips100_amount,treasure_response.data.treasure.chips250_amount,
                            treasure_response.data.treasure.chips500_amount,treasure_response.data.treasure.chips1k_amount,
                            treasure_response.data.treasure.chips5k_amount,treasure_response.data.treasure.total)

                        
                        playerCreated.treasure = treasure_response.data.player.treasure;
                        console.log("The player created is: "+playerCreated.name);
                      
                        
                        
                    })

            })
            return playerCreated;
        
         
    }
    function getPlayerRoleForGame(gameSessionID: string): string {
        return "banker";
    }
    
}
export default LocalGameService;
