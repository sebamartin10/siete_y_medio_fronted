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
import { LocalGameService } from '../../Services/LocalGameService';
import { Player } from '../../Models/Player';




const Board = () => {


    enum State {
        Bet,
        Give,
        Hit,
        Waiting

    }
    let bank: Boolean;
   
    let service = new LocalGameService(new InMemoryGameSessionRepository());


    const [playerLog,setPlayerLog] = useState("");

    const [errorPanelVisibility,setErrorPanelVisibility] = useState<any>("hidden");
    const [gameBoardVisibility, setGameBoardVisibility] = useState<any>("hidden");
    const [loginVisibility,setLoginVisibility] = useState<any>("visible");
    const [createOrJoinVisibility,setCreateOrJoinVisibility] = useState<any>("hidden");

    const [players, setPlayers] = useState(new Array<Player>(4).fill(new Player("", false)));
    const [player, setPlayer] = useState("");
    const [isBanker, setIsBanker] = useState(false);
    const [currentState, SetCurrentState] = useState(State.Waiting);

    const [totalTreasureP1, setTotalTreasure] = useState(10750);
    const [treasureP1, setTreasureP1] = useState([10, 5, 3, 2, 1]);

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




    function handleActionsVisibility() {
        let actionsVisibility = new Array(3).fill(true);
        let playerRole = service.getPlayerRoleForGame("1");
        if (playerRole === "banker") {
            actionsVisibility[0] = false;

        }
        return actionsVisibility;
    }

    function setInitialStateOfGame() {
        var newPlayers = [...players];
        newPlayers[0].name = playerLog;
        newPlayers[0].isBanker = true;
        setPlayers(newPlayers);

        let newBankVisibility = [...bankVisibility];
        newBankVisibility[0] = "visible";
        setBankVisibility(newBankVisibility);

    }
    function login(name : string, pass : string){
        setPlayerLog(name);
        setLoginVisibility("hidden");
        setCreateOrJoinVisibility("visible");
    }
    function createGame() {
        setCreateOrJoinVisibility("hidden");
        setGameBoardVisibility("visible");
        setInitialStateOfGame();
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

            <div className='errorPanel' style={{visibility:errorPanelVisibility}}>
                <label>Esto es un error del servidor.</label>
            </div>

            <div className='login' style={{visibility:loginVisibility}}>
                <div className='grid-container-x2'>
                    <div className='grid-item'>
                        <label>Name:</label>
                    </div>
                    <div className='grid-item'>
                        <input placeholder='your name'/>
                    </div>
                </div>
                <div className='grid-container-x2'>
                    <div className='grid-item'>
                        <label>Password:</label>
                    </div>
                    <div className='grid-item'>
                        <input placeholder='your password'/>
                    </div>
                </div>
                <div style={{width:"100%",top:"30px",position:"relative",textAlign:"center",margin:"10px"}}>
                    <label>If you dont have an account we are going to create one automatically.</label>
                    <br />
                    <button onClick={()=>login("Seba","Pass1")}>Login</button>
                </div>
                
            </div>





          

            
            <div className='create_or_join_panel' style={{ visibility:createOrJoinVisibility}}>
                <label>Welcome : {playerLog}</label>
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                        <Button onClick={()=>createGame()} variant="contained" size="small" >
                            Create
                        </Button>

                    </Grid>
                    <Grid item xs={4}>
                        <TextField id="outlined-basic" label="board ID" variant="standard" color='primary' />
                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" size="small">
                            Join
                        </Button>
                    </Grid>

                </Grid>
            </div>

            <div style={{ visibility: gameBoardVisibility }}>

                <div className='player3-container'>
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
                            <label style={{ position: "relative", top: "50px" }}>Other</label>
                        </div>

                        <div className='grid-item'>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item'>
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

                <div className='player2-container'>
                    <div className='total-bet' style={{ transform: "rotate(180deg)", backgroundColor: "red" }}>
                        <label>Bet : $</label>
                        <label>{totalBetP2}</label>
                        <div className='hand-resultP2'>
                            <label>WON</label>
                        </div>
                    </div>

                    <div className='grid-apuesta-container'>
                        <div className='grid-item1-apuesta' style={{ visibility: chipsVisibilityP3[0] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{chipsbetP2[0]}</label>
                        </div>
                        <div className='grid-item2-apuesta' style={{ visibility: chipsVisibilityP3[1] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{chipsbetP2[1]}</label>
                        </div>
                        <div className='grid-item3-apuesta' style={{ visibility: chipsVisibilityP3[2] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{chipsbetP2[2]}</label>
                        </div>
                        <div className='grid-item4-apuesta' style={{ visibility: chipsVisibilityP3[3] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{chipsbetP2[3]}</label>
                        </div>
                        <div className='grid-item5-apuesta' style={{ visibility: chipsVisibilityP3[4] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{chipsbetP2[4]}</label>
                        </div>
                    </div>



                    <div className='grid-container-x4'>
                        <div className='user-profile' style={{ transform: "rotate(180deg)" }}>
                            <label style={{ position: "relative", top: "50px" }}>Other</label>
                        </div>

                        <div className='grid-item'>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item'>
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

                <div className='player4-container'>
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
                            <label style={{ position: "relative", top: "50px" }}>Other</label>
                        </div>

                        <div className='grid-item'>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item'>
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

                <div className='player1-container'>
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
                            <label style={{ position: "relative", top: "50px" }}>Seba</label>
                            <div className='bank' style={{ visibility: bankVisibility[0] }}>
                                <label>BANK</label>
                            </div>
                        </div>
                        <div className='grid-item'>
                            <div className='points-container'>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item'>
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