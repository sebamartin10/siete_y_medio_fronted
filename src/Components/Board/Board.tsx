/* eslint-disable @typescript-eslint/no-unused-vars */
import '../Board/Board.css';
import Error from '../Error/Error';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import { render } from '@testing-library/react';
import { display } from '@mui/system';
import { InMemoryGameSessionRepository } from '../../Repositories/InMemoryGameSessionRepository';
import LocalGameService from '../../Services/LocalGameService';
import { Player } from '../../Models/Player';
import Treasure from '../../Models/Treasure';
import axios from 'axios';




const Board = () => {

    let playerNameInput: string;
    enum State {
        Bet,
        Give,
        Hit,
        Waiting

    }
    let bank: Boolean;




    const [playerName, setPlayerName] = useState("");
    const [playerID, setPlayerID] = useState(0);
    const[player2Name,setPlayer2Name] = useState("");
    const[player3Name,setPlayer3Name] = useState("");
    const[player4Name,setPlayer4Name] = useState("");

    const [currentSessionID, setCurrentSessionID] = useState(0);

    const [playersVisibility, setPlayersVisibility] = useState(new Array(4).fill("hidden"));
    const [errorPanelVisibility, setErrorPanelVisibility] = useState<any>("hidden");
    const [gameBoardVisibility, setGameBoardVisibility] = useState<any>("hidden");
    const [loginVisibility, setLoginVisibility] = useState<any>("visible");
    const [createOrJoinVisibility, setCreateOrJoinVisibility] = useState<any>("hidden");
    const [frontCardVisibility,setFrontCardVisibility] = useState(new Array(4).fill("hidden"));
    const [hiddenCardVisibility,setHiddenCardVisibility] = useState(new Array(4).fill("hidden"));

    const [players, setPlayers] = useState(new Array(4).fill(""));
    const [player, setPlayer] = useState("");
    const [isBanker, setIsBanker] = useState(false);
    const [currentState, SetCurrentState] = useState(State.Waiting);

    const [totalTreasureP1, setTotalTreasure] = useState(0);
    const [treasureP1, setTreasureP1] = useState([0, 0, 0, 0, 0]);

    const [totalTreasureP2, setTotalTreasureP2] = useState(10750);
    const [treasureP2, setTreasureP2] = useState([10, 5, 3, 2, 1]);

    const [totalTreasureP3, setTotalTreasureP3] = useState(10750);
    const [treasureP3, setTreasureP3] = useState([10, 5, 3, 2, 1]);

    const [totalTreasureP4, setTotalTreasureP4] = useState(10750);
    const [treasureP4, setTreasureP4] = useState([10, 5, 3, 2, 1]);

    const [totalBetP1, setTotalBetP1] = useState(0);
    const [totalBetP2, setTotalBetP2] = useState(0);
    const [totalBetP3, setTotalBetP3] = useState(0);
    const [totalBetP4, setTotalBetP4] = useState(0);


    const [chipsbet, setChipsBet] = useState([0, 0, 0, 0, 0]);
    const [chipsbetP2, setChipsBetP2] = useState([0, 0, 0, 0, 0]);
    const [chipsbetP3, setChipsBetP3] = useState([0, 0, 0, 0, 0]);
    const [chipsbetP4, setChipsBetP4] = useState([0, 0, 0, 0, 0]);

    const [chipsVisibilityP1, setChipsVisibilityP1] = useState(new Array(5).fill("hidden"));
    const [chipsVisibilityP2, setChipsVisibilityP2] = useState(new Array(5).fill("hidden"));
    const [chipsVisibilityP3, setChipsVisibilityP3] = useState(new Array(5).fill("hidden"));
    const [chipsVisibilityP4, setChipsVisibilityP4] = useState(new Array(5).fill("hidden"));


    const [actionsVisibility, setActionsVisibility] = useState(handleActionsVisibility());
    const [bankVisibility, setBankVisibility] = useState(new Array(4).fill("hidden"));


    const handleChange = (event: any) => {

        setPlayerName(event.target.value);
    };
    const handleInputSessionID = (event: any) => {
        setCurrentSessionID(event.target.value);
    }

    function handleActionsVisibility() {
        let actionsVisibility = new Array(3).fill(true);
        if(!isBanker){
            actionsVisibility[0] = false;
            actionsVisibility[1] = true;
            actionsVisibility[2] = true;
        }else{
            actionsVisibility[0] = true;
            actionsVisibility[1] = false;
            actionsVisibility[2] = false;
        }
        


        return actionsVisibility;
    }

    function setInitialStateOfGame() {
        var newPlayers = [...players];
        newPlayers[0].name = playerName;

        setPlayers(newPlayers);

        let newBankVisibility = [...bankVisibility];
        newBankVisibility[0] = "visible";
        setBankVisibility(newBankVisibility);

    }
    function login(name: string, pass: string) {

        let player = createPlayer(name);

        setLoginVisibility("hidden");
        setCreateOrJoinVisibility("visible");
    }
    function createGame() {
        setCreateOrJoinVisibility("hidden");
        setGameBoardVisibility("visible");


        axios.get('http://localhost:3000/players/' + playerID + '?')
            .then(response => {

                console.log(response.data)

                let newTreasureP1 = [...treasureP1];
                newTreasureP1[0] = response.data.treasure.chips100_amount;
                newTreasureP1[1] = response.data.treasure.chips250_amount;
                newTreasureP1[2] = response.data.treasure.chips500_amount;
                newTreasureP1[3] = response.data.treasure.chips1k_amount;
                newTreasureP1[4] = response.data.treasure.chips5k_amount;
                setTreasureP1(newTreasureP1);

                setTotalTreasure(response.data.treasure.total);

                let newPlayersVisibility = [...playersVisibility];
                newPlayersVisibility[0] = "visible";
                setPlayersVisibility(newPlayersVisibility);

                const session = {
                    maxAmountOfPlayers: 4
                };

                axios.post('http://localhost:3000/sessions', { session })
                    .then(session_response => {
                        const player_session = {
                            player_id: playerID,
                            session_id: session_response.data.session.id,
                            position_in_board : 0
                        };
                        setCurrentSessionID(session_response.data.session.id);
                        axios.post('http://localhost:3000/player_sessions', { player_session });

                        const round = {
                            bank: playerName,
                            is_current_round: true,
                            previous_turn: "",
                            current_turn: playerName,
                            next_turn: "",
                            session_id: session_response.data.session.id
                        };
                        axios.post('http://localhost:3000/rounds', { round });
                    }

                    )


            })


        setInitialStateOfGame();
    }
    function joinGame(session_id: number) {
        setCreateOrJoinVisibility("hidden");
        setGameBoardVisibility("visible");

        axios.get('http://localhost:3000/sessions/' + session_id + '?')
            .then(session_response => {
                console.log("Players : " + session_response.data.players.length);



                switch (session_response.data.players.length) {

                    case 1: {
                        //Unirse a partida
                        const player_session = {
                            player_id: playerID,
                            session_id: session_id,
                            position_in_board : 1
                        };
                        axios.post('http://localhost:3000/player_sessions', { player_session });

                        //Obtengo datos del player nuevo.
                        axios.get('http://localhost:3000/players/' + playerID + '?')
                            .then(player_responseP1 => {
                                console.log("Datos de player que se une: "+player_responseP1.data);
                                
                                
                                let newTreasureP1 = [...treasureP1];
                                newTreasureP1[0] = player_responseP1.data.treasure.chips100_amount;
                                newTreasureP1[1] = player_responseP1.data.treasure.chips250_amount;
                                newTreasureP1[2] = player_responseP1.data.treasure.chips500_amount;
                                newTreasureP1[3] = player_responseP1.data.treasure.chips1k_amount;
                                newTreasureP1[4] = player_responseP1.data.treasure.chips5k_amount;
                                setTreasureP1(newTreasureP1);
                                setTotalTreasure(player_responseP1.data.treasure.total);
                                
                                setIsBanker(false);

                                setActionsVisibility(handleActionsVisibility);

                            });

                        //Muestro el otro player
                        for(let i=0;i<session_response.data.players.length;i++){
                            if(session_response.data.players_session[i].position_in_board===0){
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP4 => {
                                        console.log("Datos de player que creo la partida: "+player_responseP4.data);
                                        let newTreasureP4 = [...treasureP4];
                                        newTreasureP4[0] = player_responseP4.data.treasure.chips100_amount;
                                        newTreasureP4[1] = player_responseP4.data.treasure.chips250_amount;
                                        newTreasureP4[2] = player_responseP4.data.treasure.chips500_amount;
                                        newTreasureP4[3] = player_responseP4.data.treasure.chips1k_amount;
                                        newTreasureP4[4] = player_responseP4.data.treasure.chips5k_amount;
                                        setTreasureP4(newTreasureP4);
                                        setTotalTreasureP4(player_responseP4.data.treasure.total);

                                        let newChipsVisibilityP4 = [...chipsVisibilityP4];
                                        newChipsVisibilityP4.fill("visible");
                                        setChipsVisibilityP4(newChipsVisibilityP4);
                                        
                                        setPlayer4Name(player_responseP4.data.player.name);
                                        
                                    });
                                
                            }
                        }
                        let newPlayersVisibility = [...playersVisibility];
                        newPlayersVisibility[0] = "visible";
                        newPlayersVisibility[3] = "visible"; 
                        setPlayersVisibility(newPlayersVisibility);

                        break;
                    }
                    case 2: {
                        //Unirse a partida
                        const player_session = {
                            player_id: playerID,
                            session_id: session_id,
                            position_in_board : 2
                        };
                        axios.post('http://localhost:3000/player_sessions', { player_session });

                        //Obtengo datos del player nuevo.
                        axios.get('http://localhost:3000/players/' + playerID + '?')
                            .then(player_responseP1 => {
                                console.log("Datos de player que se une: "+player_responseP1.data);
                                
                                
                                let newTreasureP1 = [...treasureP1];
                                newTreasureP1[0] = player_responseP1.data.treasure.chips100_amount;
                                newTreasureP1[1] = player_responseP1.data.treasure.chips250_amount;
                                newTreasureP1[2] = player_responseP1.data.treasure.chips500_amount;
                                newTreasureP1[3] = player_responseP1.data.treasure.chips1k_amount;
                                newTreasureP1[4] = player_responseP1.data.treasure.chips5k_amount;
                                setTreasureP1(newTreasureP1);
                                setTotalTreasure(player_responseP1.data.treasure.total);
                                
                                setIsBanker(false);

                                setActionsVisibility(handleActionsVisibility);

                            });

                        //Muestro el otro player
                        for(let i=0;i<session_response.data.players.length;i++){
                            if(session_response.data.players_session[i].position_in_board===0){
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP3 => {
                                        console.log("Datos de player que creo la partida: "+player_responseP3.data);
                                        let newTreasureP3 = [...treasureP3];
                                        newTreasureP3[0] = player_responseP3.data.treasure.chips100_amount;
                                        newTreasureP3[1] = player_responseP3.data.treasure.chips250_amount;
                                        newTreasureP3[2] = player_responseP3.data.treasure.chips500_amount;
                                        newTreasureP3[3] = player_responseP3.data.treasure.chips1k_amount;
                                        newTreasureP3[4] = player_responseP3.data.treasure.chips5k_amount;
                                        setTreasureP3(newTreasureP3);
                                        setTotalTreasureP3(player_responseP3.data.treasure.total);

                                        let newChipsVisibilityP3 = [...chipsVisibilityP3];
                                        newChipsVisibilityP3.fill("visible");
                                        setChipsVisibilityP3(newChipsVisibilityP3);
                                        
                                        setPlayer3Name(player_responseP3.data.player.name);
                                        
                                    });
                                
                            }
                            if(session_response.data.players_session[i].position_in_board===1){
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP4 => {
                                        console.log("Datos de player que creo la partida: "+player_responseP4.data);
                                        let newTreasureP4 = [...treasureP4];
                                        newTreasureP4[0] = player_responseP4.data.treasure.chips100_amount;
                                        newTreasureP4[1] = player_responseP4.data.treasure.chips250_amount;
                                        newTreasureP4[2] = player_responseP4.data.treasure.chips500_amount;
                                        newTreasureP4[3] = player_responseP4.data.treasure.chips1k_amount;
                                        newTreasureP4[4] = player_responseP4.data.treasure.chips5k_amount;
                                        setTreasureP4(newTreasureP4);
                                        setTotalTreasureP4(player_responseP4.data.treasure.total);

                                        let newChipsVisibilityP4 = [...chipsVisibilityP4];
                                        newChipsVisibilityP4.fill("visible");
                                        setChipsVisibilityP4(newChipsVisibilityP4);
                                        
                                        setPlayer4Name(player_responseP4.data.player.name);
                                        
                                    });
                                
                            }
                        }
                        let newPlayersVisibility = [...playersVisibility];
                        newPlayersVisibility[0] = "visible";
                        newPlayersVisibility[2] = "visible";
                        newPlayersVisibility[3] = "visible"; 
                        setPlayersVisibility(newPlayersVisibility);

                        break;
                   
                    }
                    case 3: {
                        //Unirse a partida
                        const player_session = {
                            player_id: playerID,
                            session_id: session_id,
                            position_in_board : 3
                        };
                        axios.post('http://localhost:3000/player_sessions', { player_session });

                        //Obtengo datos del player nuevo.
                        axios.get('http://localhost:3000/players/' + playerID + '?')
                            .then(player_responseP1 => {
                                console.log("Datos de player que se une: "+player_responseP1.data);
                                
                                
                                let newTreasureP1 = [...treasureP1];
                                newTreasureP1[0] = player_responseP1.data.treasure.chips100_amount;
                                newTreasureP1[1] = player_responseP1.data.treasure.chips250_amount;
                                newTreasureP1[2] = player_responseP1.data.treasure.chips500_amount;
                                newTreasureP1[3] = player_responseP1.data.treasure.chips1k_amount;
                                newTreasureP1[4] = player_responseP1.data.treasure.chips5k_amount;
                                setTreasureP1(newTreasureP1);
                                setTotalTreasure(player_responseP1.data.treasure.total);
                                
                                setIsBanker(false);

                                setActionsVisibility(handleActionsVisibility);

                            });

                        //Muestro el otro player
                        for(let i=0;i<session_response.data.players.length;i++){
                            if(session_response.data.players_session[i].position_in_board===0){
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP2 => {
                                        console.log("Datos de player que creo la partida: "+player_responseP2.data);
                                        let newTreasureP2 = [...treasureP2];
                                        newTreasureP2[0] = player_responseP2.data.treasure.chips100_amount;
                                        newTreasureP2[1] = player_responseP2.data.treasure.chips250_amount;
                                        newTreasureP2[2] = player_responseP2.data.treasure.chips500_amount;
                                        newTreasureP2[3] = player_responseP2.data.treasure.chips1k_amount;
                                        newTreasureP2[4] = player_responseP2.data.treasure.chips5k_amount;
                                        setTreasureP2(newTreasureP2);
                                        setTotalTreasureP2(player_responseP2.data.treasure.total);

                                        let newChipsVisibilityP2 = [...chipsVisibilityP2];
                                        newChipsVisibilityP2.fill("visible");
                                        setChipsVisibilityP2(newChipsVisibilityP2);
                                        
                                        setPlayer2Name(player_responseP2.data.player.name);
                                        
                                    });
                                
                            }
                            if(session_response.data.players_session[i].position_in_board===1){
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP3 => {
                                        console.log("Datos de player que creo la partida: "+player_responseP3.data);
                                        let newTreasureP3 = [...treasureP3];
                                        newTreasureP3[0] = player_responseP3.data.treasure.chips100_amount;
                                        newTreasureP3[1] = player_responseP3.data.treasure.chips250_amount;
                                        newTreasureP3[2] = player_responseP3.data.treasure.chips500_amount;
                                        newTreasureP3[3] = player_responseP3.data.treasure.chips1k_amount;
                                        newTreasureP3[4] = player_responseP3.data.treasure.chips5k_amount;
                                        setTreasureP3(newTreasureP3);
                                        setTotalTreasureP3(player_responseP3.data.treasure.total);

                                        let newChipsVisibilityP3 = [...chipsVisibilityP3];
                                        newChipsVisibilityP3.fill("visible");
                                        setChipsVisibilityP3(newChipsVisibilityP3);
                                        
                                        setPlayer3Name(player_responseP3.data.player.name);
                                        
                                    });
                                
                            }
                            if(session_response.data.players_session[i].position_in_board===2){
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP4 => {
                                        console.log("Datos de player que creo la partida: "+player_responseP4.data);
                                        let newTreasureP4 = [...treasureP4];
                                        newTreasureP4[0] = player_responseP4.data.treasure.chips100_amount;
                                        newTreasureP4[1] = player_responseP4.data.treasure.chips250_amount;
                                        newTreasureP4[2] = player_responseP4.data.treasure.chips500_amount;
                                        newTreasureP4[3] = player_responseP4.data.treasure.chips1k_amount;
                                        newTreasureP4[4] = player_responseP4.data.treasure.chips5k_amount;
                                        setTreasureP4(newTreasureP4);
                                        setTotalTreasureP4(player_responseP4.data.treasure.total);

                                        let newChipsVisibilityP4 = [...chipsVisibilityP4];
                                        newChipsVisibilityP4.fill("visible");
                                        setChipsVisibilityP4(newChipsVisibilityP4);
                                        
                                        setPlayer4Name(player_responseP4.data.player.name);
                                        
                                    });
                                
                            }
                        }
                        let newPlayersVisibility = [...playersVisibility];
                        newPlayersVisibility[0] = "visible";
                        newPlayersVisibility[1] = "visible"; 
                        newPlayersVisibility[2] = "visible";
                        newPlayersVisibility[3] = "visible"; 
                        setPlayersVisibility(newPlayersVisibility);
                        break;
                    }
                    default: {
                        //statements; 
                        break;
                    }
                }
            })
    }
    function createPlayer(name: string) {
        const player = {
            name: name
        };
        axios.post('http://localhost:3000/players', { player })
            .then(player_response => {
                setPlayerID(player_response.data.player.id);

                const treasure = {
                    chips100_amount: 10,
                    chips250_amount: 5,
                    chips500_amount: 3,
                    chips1k_amount: 2,
                    chips5k_amount: 1,
                    total: 10750,
                    player_id: player_response.data.player.id
                };


                axios.post('http://localhost:3000/treasures', { treasure })
                    .then(treasure_response => {
                        console.log(treasure_response.data.treasure);

                    })

            })

    }



    const handleClick = (index: number) => {
        if (treasureP1[index] <= 0)
            return;

        let newTreasure = [...treasureP1];
        newTreasure.splice(index, 1, treasureP1[index] - 1);
        setTreasureP1(newTreasure);

        let newChipsBet = [...chipsbet];
        newChipsBet.splice(index, 1, chipsbet[index] + 1);
        setChipsBet(newChipsBet);

        let newChipsVisibilityP1 = [...chipsVisibilityP1];
        newChipsVisibilityP1.splice(index, 1, "visible");
        setChipsVisibilityP1(newChipsVisibilityP1);


        chipsVisibilityP1[index] = "visible";
        calculateTotalBet(newChipsBet);
        calculateTotalTreasure(newTreasure);
    }

    function calculateTotalBet(chipsBet: number[]) {

        let totalBet = chipsBet[0] * 100 + chipsBet[1] * 250 + chipsBet[2] * 500 + chipsBet[3] * 1000 + chipsBet[4] * 5000;

        setTotalBetP1(totalBet);
    }
    function calculateTotalTreasure(treasure: number[]) {
        let totalTreasure = treasure[0] * 100 + treasure[1] * 250 + treasure[2] * 500 + treasure[3] * 1000 + treasure[4] * 5000;

        setTotalTreasure(totalTreasure);
    }

    const pickUpChipFromBet = (index: number) => {

        if (chipsVisibilityP1[index] === "hidden")
            return;

        let newChipsBet = [...chipsbet];
        newChipsBet.splice(index, 1, chipsbet[index] - 1);
        setChipsBet(newChipsBet);

        console.log(chipsbet[index]);
        if (chipsbet[index] <= 1) {
            let newChipsVisibilityP1 = [...chipsVisibilityP1];
            newChipsVisibilityP1.splice(index, 1, "hidden");
            setChipsVisibilityP1(newChipsVisibilityP1);
        }

        let newTreasure = [...treasureP1];
        newTreasure.splice(index, 1, treasureP1[index] + 1);
        setTreasureP1(newTreasure);

        calculateTotalBet(newChipsBet);
        calculateTotalTreasure(newTreasure);
    }


    return (
        <div className="board">
            <label>Session ID : {currentSessionID}</label>
            <div className='errorPanel' style={{ visibility: errorPanelVisibility }}>
                <label>Esto es un error del servidor.</label>
            </div>

            <div className='login' style={{ visibility: loginVisibility }}>
                <div className='grid-container-x2'>
                    <div className='grid-item'>
                        <label>Name:</label>
                    </div>
                    <div className='grid-item'>
                        <input placeholder='your name' onChange={handleChange} value={playerName} />
                    </div>
                </div>
                <div className='grid-container-x2'>
                    <div className='grid-item'>
                        <label>Password:</label>
                    </div>
                    <div className='grid-item'>
                        <input placeholder='your password' />
                    </div>
                </div>
                <div style={{ width: "100%", top: "30px", position: "relative", textAlign: "center", margin: "10px" }}>
                    <label>If you dont have an account we are going to create one automatically.</label>
                    <br />
                    <button onClick={() => login(playerName, "Pass1")}>Login</button>
                </div>

            </div>








            <div className='create_or_join_panel' style={{ visibility: createOrJoinVisibility }}>
                <label>Welcome : {playerName}</label>
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                        <Button onClick={() => createGame()} variant="contained" size="small" >
                            Create
                        </Button>

                    </Grid>
                    <Grid item xs={4}>
                        <input placeholder='Session ID' onChange={handleInputSessionID} value={currentSessionID} />
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" size="small" onClick={() => joinGame(currentSessionID)}>
                            Join
                        </Button>
                    </Grid>

                </Grid>
            </div>

            <div style={{ visibility: gameBoardVisibility }}>

                <div className='player3-container' style={{ visibility: playersVisibility[2] }}>
                    <div className='total-bet' style={{ transform: "rotate(180deg)" }}>
                        <label>Bet : $</label>
                        <label>{totalBetP3}</label>
                        <div className='hand-resultP3'>
                            <label>WON</label>
                        </div>
                    </div>

                    <div className='grid-apuesta-container'>
                        <div className='grid-item1-apuesta' style={{ visibility: chipsVisibilityP3[0] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{chipsbetP3[0]}</label>
                        </div>
                        <div className='grid-item2-apuesta' style={{ visibility: chipsVisibilityP3[1] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{chipsbetP3[1]}</label>
                        </div>
                        <div className='grid-item3-apuesta' style={{ visibility: chipsVisibilityP3[2] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{chipsbetP3[2]}</label>
                        </div>
                        <div className='grid-item4-apuesta' style={{ visibility: chipsVisibilityP3[3] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{chipsbetP3[3]}</label>
                        </div>
                        <div className='grid-item5-apuesta' style={{ visibility: chipsVisibilityP3[4] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{chipsbet[4]}</label>
                        </div>
                    </div>



                    <div className='grid-container-x4'>
                        <div className='user-profile' style={{ transform: "rotate(180deg)" }}>
                            <label style={{ position: "relative", top: "50px" }}>{player3Name}</label>
                        </div>

                        <div className='grid-item' style={{visibility:hiddenCardVisibility[2]}}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item' style={{visibility:frontCardVisibility[2]}}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-front'>

                            </div>
                        </div>
                        <div className='grid-item' style={{ visibility: "hidden" }}>
                            <div className='points-container'>
                                <label>5</label>
                            </div>
                            <div className='menu-actions'>
                                <button className='action-button' disabled={actionsVisibility[0]}>Give</button>
                                <button className='action-button' disabled={actionsVisibility[1]}>Hit</button>
                                <button className='action-button' disabled={actionsVisibility[2]}>Bet</button>
                            </div>
                        </div>

                    </div>


                    <div className='grid-container'>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{treasureP3[0]}</label>

                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{treasureP3[1]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{treasureP3[2]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{treasureP3[3]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{treasureP3[4]}</label>
                        </div>
                    </div>

                    <div className='total-treasure' style={{ transform: "rotate(180deg)" }}>
                        <label>Money : $</label>
                        <label>{totalTreasureP3}</label>
                    </div>

                </div>

                <div className='player2-container' style={{ visibility: playersVisibility[1] }}>
                    <div className='total-bet' style={{ transform: "rotate(180deg)", backgroundColor: "red" }}>
                        <label>Bet : $</label>
                        <label>{totalBetP2}</label>
                        <div className='hand-resultP2'>
                            <label>WON</label>
                        </div>
                    </div>

                    <div className='grid-apuesta-container'>
                        <div className='grid-item1-apuesta' style={{ visibility: chipsVisibilityP2[0] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{chipsbetP2[0]}</label>
                        </div>
                        <div className='grid-item2-apuesta' style={{ visibility: chipsVisibilityP2[1] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{chipsbetP2[1]}</label>
                        </div>
                        <div className='grid-item3-apuesta' style={{ visibility: chipsVisibilityP2[2] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{chipsbetP2[2]}</label>
                        </div>
                        <div className='grid-item4-apuesta' style={{ visibility: chipsVisibilityP2[3] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{chipsbetP2[3]}</label>
                        </div>
                        <div className='grid-item5-apuesta' style={{ visibility: chipsVisibilityP2[4] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{chipsbetP2[4]}</label>
                        </div>
                    </div>



                    <div className='grid-container-x4'>
                        <div className='user-profile' style={{ transform: "rotate(180deg)" }}>
                            <label style={{ position: "relative", top: "50px" }}>{player2Name}</label>
                        </div>

                        <div className='grid-item' style={{visibility:hiddenCardVisibility[1]}}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item' style={{visibility:frontCardVisibility[1]}}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-front'>

                            </div>
                        </div>
                        <div className='grid-item' style={{ visibility: "hidden" }}>
                            <div className='points-container'>
                                <label>5</label>
                            </div>
                            <div className='menu-actions'>
                                <button className='action-button' disabled={actionsVisibility[0]}>Give</button>
                                <button className='action-button' disabled={actionsVisibility[1]}>Hit</button>
                                <button className='action-button' disabled={actionsVisibility[2]}>Bet</button>
                            </div>
                        </div>

                    </div>


                    <div className='grid-container'>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{treasureP2[0]}</label>

                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{treasureP2[1]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{treasureP2[2]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{treasureP2[3]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{treasureP2[4]}</label>
                        </div>
                    </div>

                    <div className='total-treasure' style={{ transform: "rotate(180deg)", backgroundColor: "red" }}>
                        <label>Money : $</label>
                        <label>{totalTreasureP2}</label>
                    </div>

                </div>

                <div className='player4-container' style={{ visibility: playersVisibility[3] }}>
                    <div className='total-bet' style={{ transform: "rotate(180deg)", backgroundColor: "green" }}>
                        <label>Bet : $</label>
                        <label>{totalBetP4}</label>
                        <div className='hand-resultP4' style={{ transform: "rotate(-90deg)" }}>
                            <label>WON</label>
                        </div>
                    </div>

                    <div className='grid-apuesta-container'>
                        <div className='grid-item1-apuesta' style={{ visibility: chipsVisibilityP3[0] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{chipsbetP4[0]}</label>
                        </div>
                        <div className='grid-item2-apuesta' style={{ visibility: chipsVisibilityP3[1] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{chipsbetP4[1]}</label>
                        </div>
                        <div className='grid-item3-apuesta' style={{ visibility: chipsVisibilityP3[2] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{chipsbetP4[2]}</label>
                        </div>
                        <div className='grid-item4-apuesta' style={{ visibility: chipsVisibilityP3[3] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{chipsbetP4[3]}</label>
                        </div>
                        <div className='grid-item5-apuesta' style={{ visibility: chipsVisibilityP3[4] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{chipsbetP4[4]}</label>
                        </div>
                    </div>



                    <div className='grid-container-x4'>
                        <div className='user-profile' style={{ transform: "rotate(180deg)" }}>
                            <label style={{ position: "relative", top: "50px" }}>{player4Name}</label>
                        </div>

                        <div className='grid-item' style={{visibility:hiddenCardVisibility[2]}}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item' style={{visibility:frontCardVisibility[2]}}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-front'>

                            </div>
                        </div>
                        <div className='grid-item' style={{ visibility: "hidden" }}>
                            <div className='points-container'>
                                <label>5</label>
                            </div>
                            <div className='menu-actions'>
                                <button className='action-button' disabled={actionsVisibility[0]}>Give</button>
                                <button className='action-button' disabled={actionsVisibility[1]}>Hit</button>
                                <button className='action-button' disabled={actionsVisibility[2]}>Bet</button>
                            </div>
                        </div>

                    </div>


                    <div className='grid-container'>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{treasureP4[0]}</label>

                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{treasureP4[1]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{treasureP4[2]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{treasureP4[3]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{treasureP4[4]}</label>
                        </div>
                    </div>

                    <div className='total-treasure' style={{ transform: "rotate(180deg)", backgroundColor: "green" }}>
                        <label>Money : $</label>
                        <label>{totalTreasureP4}</label>
                    </div>

                </div>

                <div className='player1-container' style={{ visibility: playersVisibility[0] }}>
                    <div className='total-bet' style={{ backgroundColor: "blue" }}>
                        <label>Bet : $</label>
                        <label>{totalBetP1}</label>
                    </div>
                    <div className='hand-result'>
                        <label>WON</label>
                    </div>

                    <div className='grid-apuesta-container'>
                        <div className='grid-item1-apuesta' style={{ visibility: chipsVisibilityP1[0] }}>
                            <div className='chip' onClick={() => pickUpChipFromBet(0)} style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{chipsbet[0]}</label>
                        </div>
                        <div className='grid-item2-apuesta' style={{ visibility: chipsVisibilityP1[1] }}>
                            <div className='chip' onClick={() => pickUpChipFromBet(1)} style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{chipsbet[1]}</label>
                        </div>
                        <div className='grid-item3-apuesta' style={{ visibility: chipsVisibilityP1[2] }}>
                            <div className='chip' onClick={() => pickUpChipFromBet(2)} style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{chipsbet[2]}</label>
                        </div>
                        <div className='grid-item4-apuesta' style={{ visibility: chipsVisibilityP1[3] }}>
                            <div className='chip' onClick={() => pickUpChipFromBet(3)} style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{chipsbet[3]}</label>
                        </div>
                        <div className='grid-item5-apuesta' style={{ visibility: chipsVisibilityP1[4] }}>
                            <div className='chip' onClick={() => pickUpChipFromBet(4)} style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{chipsbet[4]}</label>
                        </div>
                    </div>



                    <div className='grid-container-x4'>
                        <div className='user-profile'>
                            <label style={{ position: "relative", top: "50px" }}>{playerName}</label>
                            <div className='bank' style={{ visibility: bankVisibility[0] }}>
                                <label>BANK</label>
                            </div>
                        </div>
                        <div className='grid-item' style={{visibility:hiddenCardVisibility[0]}}>
                            <div className='points-container'>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item' style={{visibility:frontCardVisibility[0]}}>
                            <div className='points-container'>
                                <label>5</label>
                            </div>
                            <div className='card-front'>

                            </div>
                        </div>
                        <div className='grid-item'>
                            <div className='points-container'>
                                <label>5</label>
                            </div>
                            <div className='menu-actions'>
                                <button className='action-button' disabled={actionsVisibility[0]}>Give</button>
                                <button className='action-button' disabled={actionsVisibility[1]}>Hit</button>
                                <button className='action-button' disabled={actionsVisibility[2]}>Bet</button>
                            </div>
                        </div>

                    </div>


                    <div className='grid-container'>
                        <div className='grid-item'>
                            <div className='chip' onClick={() => handleClick(0)} style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{treasureP1[0]}</label>

                        </div>
                        <div className='grid-item'>
                            <div className='chip' onClick={() => handleClick(1)} style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{treasureP1[1]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' onClick={() => handleClick(2)} style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{treasureP1[2]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' onClick={() => handleClick(3)} style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{treasureP1[3]}</label>
                        </div>
                        <div className='grid-item'>
                            <div className='chip' onClick={() => handleClick(4)} style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{treasureP1[4]}</label>
                        </div>
                    </div>

                    <div className='total-treasure' style={{ backgroundColor: "blue" }}>
                        <label>Money : $</label>
                        <label>{totalTreasureP1}</label>
                    </div>

                </div>
            </div>


















        </div>
    );
}
export default Board;