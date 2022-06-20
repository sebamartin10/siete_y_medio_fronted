/* eslint-disable no-loop-func */
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
import axios, { AxiosResponse } from 'axios';
import { url } from 'inspector';



var askForFirstCard: boolean = false;
var bank: string = "";
var roundID: number = 0;
var myCardPoints: number = 0;


const Board = () => {

    let playerNameInput: string;
    enum State {
        Bet,
        Give,
        Hit,
        Waiting

    }

    let positionInBoard: number = 0;

    let sessionID: number = 0;


    let player2ID: number = 0;
    let player3ID: number = 0;
    let player4ID: number = 0;





    const imagePath = "img/cards/oro/";



    const [playerName, setPlayerName] = useState("");
    const [playerID, setPlayerID] = useState(0);
    const [myHandID, setMyHandID] = useState(0);



    const [player2Name, setPlayer2Name] = useState("");
    const [player3Name, setPlayer3Name] = useState("");
    const [player4Name, setPlayer4Name] = useState("");
    const [playerOnTheLeft, setPlayerOnTheLeft] = useState("");

    const [feedbackP1, setFeedbackP1] = useState("Waiting");
    const [feedbackP2, setFeedbackP2] = useState("Waiting");
    const [feedbackP3, setFeedbackP3] = useState("Waiting");
    const [feedbackP4, setFeedbackP4] = useState("Waiting");

    const [currentSessionID, setCurrentSessionID] = useState(0);
    const [currentRoundID, setCurrentRoundID] = useState(0);
    const [turnOf, setTurnOf] = useState("");

    const [playersVisibility, setPlayersVisibility] = useState(new Array(4).fill("hidden"));
    const [errorPanelVisibility, setErrorPanelVisibility] = useState<any>("hidden");
    const [gameBoardVisibility, setGameBoardVisibility] = useState<any>("hidden");
    const [loginVisibility, setLoginVisibility] = useState<any>("visible");
    const [createOrJoinVisibility, setCreateOrJoinVisibility] = useState<any>("hidden");

    const [frontCardVisibilityP1, setFrontCardVisibilityP1] = useState<any>("hidden");
    const [frontCardImageP1, setFrontCardImageP1] = useState("");
    const [hiddenCardVisibilityP1, setHiddenCardVisibilityP1] = useState<any>("hidden");
    const [hiddenCardPoints, setHiddenCardPoints] = useState(0);
    const [visibleCardPoints, setVisibleCardPoints] = useState(0);
    const [totalCardPoints, setTotalCardPoints] = useState(0);

    const [frontCardVisibility, setFrontCardVisibility] = useState(new Array(3).fill("hidden"));
    const [hiddenCardVisibility, setHiddenCardVisibility] = useState(new Array(3).fill("hidden"));
    const [frontCardImageP2, setFrontCardImageP2] = useState("");
    const [frontCardImageP3, setFrontCardImageP3] = useState("");
    const [frontCardImageP4, setFrontCardImageP4] = useState("");



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

    const [chipsInteractable, setChipsInteractable] = useState(new Array(5).fill(false));


    const [actionsVisibility, setActionsVisibility] = useState([true, false, true]);
    const [bankVisibility, setBankVisibility] = useState(new Array(4).fill("hidden"));




    const handleChange = (event: any) => {

        setPlayerName(event.target.value);
    };
    const handleInputSessionID = (event: any) => {
        setCurrentSessionID(event.target.value);
    }

    function payToPlayers() {

        axios.get("http://localhost:3000/rounds/" + currentRoundID + "?")
            .then(currentRound => {
                for (let i = 0; i < currentRound.data.player_hands.length; i++) {
                    if (currentRound.data.player_hands[i].player_id !== playerID) {
                        axios.get("http://localhost:3000/player_hands/" + currentRound.data.player_hands[i].id + "?")
                            .then(player_hand => {
                                console.log("Le debo pagar al id del player " + player_hand.data.player_hand.player_id);

                                let chips100_amount: number = currentRound.data.player_bets[i].chips100_amount;
                                let chips250_amount: number = currentRound.data.player_bets[i].chips250_amount;
                                let chips500_amount: number = currentRound.data.player_bets[i].chips500_amount;
                                let chips1k_amount: number = currentRound.data.player_bets[i].chips1k_amount;
                                let chips5k_amount: number = currentRound.data.player_bets[i].chips5k_amount;



                                axios.get("http://localhost:3000/players/" + player_hand.data.player_hand.player_id)
                                    .then(treasure_response => {
                                        let new_chips100_amount = treasure_response.data.treasure.chips100_amount + chips100_amount;
                                        let new_chips250_amount = treasure_response.data.treasure.chips250_amount + chips250_amount;
                                        let new_chips500_amount = treasure_response.data.treasure.chips500_amount + chips500_amount;
                                        let new_chips1k_amount = treasure_response.data.treasure.chips1k_amount + chips1k_amount;
                                        let new_chips5k_amount = treasure_response.data.treasure.chips5k_amount + chips5k_amount;
                                        let newTotal = (new_chips100_amount * 100) + (new_chips250_amount * 250) + (new_chips500_amount * 500) + (new_chips1k_amount * 1000) + (new_chips5k_amount * 5000);
                                        const treasure = {
                                            chips100_amount: new_chips100_amount,
                                            chips250_amount: new_chips250_amount,
                                            chips500_amount: new_chips500_amount,
                                            chips1k_amount: new_chips1k_amount,
                                            chips5k_amount: new_chips5k_amount,
                                            total: newTotal
                                        };
                                        axios.put("http://localhost:3000/treasures/" + treasure_response.data.treasure.id + "?", { treasure })
                                    });
                                axios.get("http://localhost:3000/players/" + playerID + "?")
                                    .then(myTreasure => {
                                        console.log("Mis fichas de 100 son " + myTreasure.data.treasure.chips100_amount);
                                        let new_chips100_amount = myTreasure.data.treasure.chips100_amount - chips100_amount;
                                        let new_chips250_amount = myTreasure.data.treasure.chips250_amount - chips250_amount;
                                        let new_chips500_amount = myTreasure.data.treasure.chips500_amount - chips500_amount;
                                        let new_chips1k_amount = myTreasure.data.treasure.chips1k_amount - chips1k_amount;
                                        let new_chips5k_amount = myTreasure.data.treasure.chips5k_amount - chips5k_amount;
                                        let newTotal = (new_chips100_amount * 100) + (new_chips250_amount * 250) + (new_chips500_amount * 500) + (new_chips1k_amount * 1000) + (new_chips5k_amount * 5000);
                                        const treasure = {
                                            chips100_amount: new_chips100_amount,
                                            chips250_amount: new_chips250_amount,
                                            chips500_amount: new_chips500_amount,
                                            chips1k_amount: new_chips1k_amount,
                                            chips5k_amount: new_chips5k_amount,
                                            total: newTotal
                                        }
                                        axios.put("http://localhost:3000/treasures/" + myTreasure.data.treasure.id + "?", { treasure })
                                            .then(treasure_updated => {
                                                let newTreasureP1 = [...treasureP1];
                                                newTreasureP1[0] = treasure_updated.data.treasure.chips100_amount;
                                                newTreasureP1[1] = treasure_updated.data.treasure.chips250_amount;
                                                newTreasureP1[2] = treasure_updated.data.treasure.chips500_amount;
                                                newTreasureP1[3] = treasure_updated.data.treasure.chips1k_amount;
                                                newTreasureP1[4] = treasure_updated.data.treasure.chips5k_amount;
                                                setTreasureP1(newTreasureP1)
                                                console.log("El nuevo total del tesoro es: " + treasure_updated.data.treasure.total);
                                                setTotalTreasure(treasure_updated.data.treasure.total);

                                                let newchipsVisibility = [...chipsVisibilityP1];
                                                newchipsVisibility.fill("hidden");
                                                setChipsVisibilityP1(newchipsVisibility);
                                            });
                                    });
                            });
                    }
                }


            });
    }


    function createRound() {

        console.log("Se crea una nueva ronda donde el turno es de " + playerOnTheLeft);
        //Creo una nueva
        const round = {
            bank: playerName,
            is_current_round: true,
            current_turn: playerOnTheLeft,
            session_id: currentSessionID
        };
        axios.post("http://localhost:3000/rounds", { round })
            .then(round_response => {
                setCurrentRoundID(round_response.data.round.id);
                roundID = round_response.data.round.id;
                toggleActions(true, false, true);
            })
    }
    
    
    function process_results(myCardPoints : number) {

        if (myCardPoints > 7.5) {

            payToPlayers();

        } else {
            axios.get("http://localhost:3000/rounds/" + currentRoundID + "?")
                .then(currentRound => {

                    for (let i = 0; i < currentRound.data.player_hands.length; i++) {
                        if (currentRound.data.player_hands[i].player_id !== playerID) {
                            axios.get("http://localhost:3000/player_hands/" + currentRound.data.player_hands[i].id + "?")
                                .then(player_hand => {
                                    console.log("El total de puntos de cartas del otro player es " + player_hand.data.player_hand.total_points);
                                    if (player_hand.data.player_hand.total_points > myCardPoints && player_hand.data.player_hand.total_points <= 7.5) {
                                        //Debo pagarle
                                        console.log("Le debo pagar al id del player " + player_hand.data.player_hand.player_id);
                                        let chips100_amount: number = currentRound.data.player_bets[i].chips100_amount;
                                        let chips250_amount: number = currentRound.data.player_bets[i].chips250_amount;
                                        let chips500_amount: number = currentRound.data.player_bets[i].chips500_amount;
                                        let chips1k_amount: number = currentRound.data.player_bets[i].chips1k_amount;
                                        let chips5k_amount: number = currentRound.data.player_bets[i].chips5k_amount;



                                        axios.get("http://localhost:3000/players/" + player_hand.data.player_hand.player_id)
                                            .then(treasure_response => {
                                                let new_chips100_amount = treasure_response.data.treasure.chips100_amount + chips100_amount;
                                                let new_chips250_amount = treasure_response.data.treasure.chips250_amount + chips250_amount;
                                                let new_chips500_amount = treasure_response.data.treasure.chips500_amount + chips500_amount;
                                                let new_chips1k_amount = treasure_response.data.treasure.chips1k_amount + chips1k_amount;
                                                let new_chips5k_amount = treasure_response.data.treasure.chips5k_amount + chips5k_amount;
                                                let newTotal = (new_chips100_amount * 100) + (new_chips250_amount * 250) + (new_chips500_amount * 500) + (new_chips1k_amount * 1000) + (new_chips5k_amount * 5000);
                                                const treasure = {
                                                    chips100_amount: new_chips100_amount,
                                                    chips250_amount: new_chips250_amount,
                                                    chips500_amount: new_chips500_amount,
                                                    chips1k_amount: new_chips1k_amount,
                                                    chips5k_amount: new_chips5k_amount,
                                                    total: newTotal
                                                };
                                                axios.put("http://localhost:3000/treasures/" + treasure_response.data.treasure.id + "?", { treasure })
                                            });
                                        axios.get("http://localhost:3000/players/" + playerID + "?")
                                            .then(myTreasure => {
                                                let new_chips100_amount = myTreasure.data.treasure.chips100_amount - chips100_amount;
                                                let new_chips250_amount = myTreasure.data.treasure.chips250_amount - chips250_amount;
                                                let new_chips500_amount = myTreasure.data.treasure.chips500_amount - chips500_amount;
                                                let new_chips1k_amount = myTreasure.data.treasure.chips1k_amount - chips1k_amount;
                                                let new_chips5k_amount = myTreasure.data.treasure.chips5k_amount - chips5k_amount;
                                                let newTotal = (new_chips100_amount * 100) + (new_chips250_amount * 250) + (new_chips500_amount * 500) + (new_chips1k_amount * 1000) + (new_chips5k_amount * 5000);
                                                const treasure = {
                                                    chips100_amount: new_chips100_amount,
                                                    chips250_amount: new_chips250_amount,
                                                    chips500_amount: new_chips500_amount,
                                                    chips1k_amount: new_chips1k_amount,
                                                    chips5k_amount: new_chips5k_amount,
                                                    total: newTotal
                                                }
                                                axios.put("http://localhost:3000/treasures/" + myTreasure.data.treasure.id + "?", { treasure })
                                                    .then(treasure_updated => {
                                                        let newTreasureP1 = [...treasureP1];
                                                        newTreasureP1[0] = treasure_updated.data.treasure.chips100_amount;
                                                        newTreasureP1[1] = treasure_updated.data.treasure.chips250_amount;
                                                        newTreasureP1[2] = treasure_updated.data.treasure.chips500_amount;
                                                        newTreasureP1[3] = treasure_updated.data.treasure.chips1k_amount;
                                                        newTreasureP1[4] = treasure_updated.data.treasure.chips5k_amount;
                                                        setTreasureP1(newTreasureP1)
                                                        console.log("El nuevo total del tesoro es: " + treasure_updated.data.treasure.total);
                                                        setTotalTreasure(treasure_updated.data.treasure.total);

                                                        let newchipsVisibility = [...chipsVisibilityP1];
                                                        newchipsVisibility.fill("hidden");
                                                        setChipsVisibilityP1(newchipsVisibility);
                                                    })
                                            })
                                    }
                                    else {
                                        //Debo cobrarle
                                        console.log("Le debo cobrar al id del player " + player_hand.data.player_hand.player_id);
                                        let chips100_amount_playerbet: number = currentRound.data.player_bets[i].chips100_amount;
                                        let chips250_amount_playerbet: number = currentRound.data.player_bets[i].chips250_amount;
                                        let chips500_amount_playerbet: number = currentRound.data.player_bets[i].chips500_amount;
                                        let chips1k_amount_playerbet: number = currentRound.data.player_bets[i].chips1k_amount;
                                        let chips5k_amount_playerbet: number = currentRound.data.player_bets[i].chips5k_amount;

                                        //Le modifico su treasure
                                        axios.get("http://localhost:3000/players/" + player_hand.data.player_hand.player_id)
                                            .then(treasure_response => {
                                                let new_chips100_amount = treasure_response.data.treasure.chips100_amount - chips100_amount_playerbet;
                                                let new_chips250_amount = treasure_response.data.treasure.chips250_amount - chips250_amount_playerbet;
                                                let new_chips500_amount = treasure_response.data.treasure.chips500_amount - chips500_amount_playerbet;
                                                let new_chips1k_amount = treasure_response.data.treasure.chips1k_amount - chips1k_amount_playerbet;
                                                let new_chips5k_amount = treasure_response.data.treasure.chips5k_amount - chips5k_amount_playerbet;
                                                let newTotal = (new_chips100_amount * 100) + (new_chips250_amount * 250) + (new_chips500_amount * 500) + (new_chips1k_amount * 1000) + (new_chips5k_amount * 5000);
                                                const treasure = {
                                                    chips100_amount: new_chips100_amount,
                                                    chips250_amount: new_chips250_amount,
                                                    chips500_amount: new_chips500_amount,
                                                    chips1k_amount: new_chips1k_amount,
                                                    chips5k_amount: new_chips5k_amount,
                                                    total: newTotal
                                                };
                                                axios.put("http://localhost:3000/treasures/" + treasure_response.data.treasure.id + "?", { treasure })
                                            });
                                        //Me modifico mi treasure

                                        axios.get("http://localhost:3000/players/" + playerID + "?")
                                            .then(myTreasure => {
                                                let new_chips100_amount = myTreasure.data.treasure.chips100_amount + chips100_amount_playerbet;
                                                let new_chips250_amount = myTreasure.data.treasure.chips250_amount + chips250_amount_playerbet;
                                                let new_chips500_amount = myTreasure.data.treasure.chips500_amount + chips500_amount_playerbet;
                                                let new_chips1k_amount = myTreasure.data.treasure.chips1k_amount + chips1k_amount_playerbet;
                                                let new_chips5k_amount = myTreasure.data.treasure.chips5k_amount + chips5k_amount_playerbet;
                                                let newTotal = (new_chips100_amount * 100) + (new_chips250_amount * 250) + (new_chips500_amount * 500) + (new_chips1k_amount * 1000) + (new_chips5k_amount * 5000);
                                                const treasure = {
                                                    chips100_amount: new_chips100_amount,
                                                    chips250_amount: new_chips250_amount,
                                                    chips500_amount: new_chips500_amount,
                                                    chips1k_amount: new_chips1k_amount,
                                                    chips5k_amount: new_chips5k_amount,
                                                    total: newTotal
                                                }

                                                treasure.total = newTotal;
                                                console.log("El nuevo total del tesoro es: " + treasure.total);
                                                axios.put("http://localhost:3000/treasures/" + myTreasure.data.treasure.id + "?", { treasure })
                                                    .then(treasure_updated_response => {

                                                        let newTreasureP1 = [...treasureP1];
                                                        newTreasureP1[0] = treasure_updated_response.data.treasure.chips100_amount;
                                                        newTreasureP1[1] = treasure_updated_response.data.treasure.chips250_amount;
                                                        newTreasureP1[2] = treasure_updated_response.data.treasure.chips500_amount;
                                                        newTreasureP1[3] = treasure_updated_response.data.treasure.chips1k_amount;
                                                        newTreasureP1[4] = treasure_updated_response.data.treasure.chips5k_amount;
                                                        setTreasureP1(newTreasureP1)

                                                        setTotalTreasure(treasure_updated_response.data.treasure.total);

                                                        let newchipsVisibility = [...chipsVisibilityP1];
                                                        newchipsVisibility.fill("hidden");
                                                        setChipsVisibilityP1(newchipsVisibility);
                                                    })


                                            });
                                    }
                                })
                        }
                    }
                });
        }

    }




    function checkForTurn() {

        axios.get('http://localhost:3000/sessions/' + sessionID + '?')
            .then(session => {

                for (let i = 0; i < session.data.rounds.length; i++) {

                    if (session.data.rounds[i].is_current_round) {

                        if (session.data.rounds[i].current_turn === playerName) {
                            setCurrentRoundID(session.data.rounds[i].id);
                            roundID = session.data.rounds[i].id;
                            setFeedbackP1("Playing");
                            setFeedbackP2("Waiting");
                            setFeedbackP3("Waiting");
                            setFeedbackP4("Waiting");


                            if (session.data.rounds[i].bank === playerName) {
                                setIsBanker(true);
                                toggleActions(false, true, false);
                                let newChipsInteractable = [...chipsInteractable];
                                newChipsInteractable.fill(true);
                                setChipsInteractable(newChipsInteractable);

                            } else {
                                setIsBanker(false);
                                
                                toggleActions(false, false, false);
                                let newChipsInteractable = [...chipsInteractable];
                                newChipsInteractable.fill(false);
                                setChipsInteractable(newChipsInteractable);

                            }




                        } else {
                            setFeedbackP1("Waiting");
                            toggleActions(true, true, true);

                        }







                    }
                }
            });
    }
    function toggleActions(hit: boolean, bet: boolean, plant: boolean) {

        let newActionsVisibility = [...actionsVisibility]
        newActionsVisibility[0] = hit;
        newActionsVisibility[1] = bet;
        newActionsVisibility[2] = plant;
        if (isBanker) {
            newActionsVisibility[1] = true;
        }
        setActionsVisibility(newActionsVisibility);
    }
    function finishTurn() {
        askForFirstCard = false;

        if (isBanker) {


            process_results(myCardPoints);
            setTimeout(()=>{
                finishRound();
                createRound();
            },2000)
            
           


        } else {
            const round = {
                current_turn: playerOnTheLeft,
                is_current_round: true
            };
            console.log("Cambio el turno a " + playerOnTheLeft);
            axios.put("http://localhost:3000/rounds/" + currentRoundID + "?", round);



        }
        toggleActions(true, true, true);
        myCardPoints = 0;

    }
    function finishRound() {
        //Termino la ronda actual
        axios.get("http://localhost:3000/rounds/" + currentRoundID + "?")
            .then(roundToUpdate => {
                const round = {
                    is_current_round: false
                };
                axios.put("http://localhost:3000/rounds/" + roundToUpdate.data.round.id, { round });

            })
    }

    function hit() {
        //Obtengo carta al azar
        axios.get("http://localhost:3000/cards")
            .then(cards => {
                const card = cards.data[Math.floor(Math.random() * (9 - 0 + 1)) + 0];
                var cardPoints: number = card.points;
                setTotalCardPoints(cardPoints);

                myCardPoints += cardPoints;
                console.log("Mi total de puntos en carta es de " + myCardPoints);
                if (!askForFirstCard) {
                    askForFirstCard = true;
                    console.log("Puntos de carta invisible: " + card.points);
                    setHiddenCardVisibilityP1("visible");
                    setHiddenCardPoints(card.points);
                    const player_hand = {
                        total_points: cardPoints,
                        player_id: playerID,
                        round_id: currentRoundID
                    };
                    axios.post("http://localhost:3000/player_hands", { player_hand })
                        .then(player_hand_response => {
                            setMyHandID(player_hand_response.data.player_hand.id);


                            const player_card = {
                                is_card_visible: false,
                                player_hand_id: player_hand_response.data.player_hand.id,
                                card_id: card.id
                            };
                            axios.post("http://localhost:3000/player_cards", { player_card });
                        });

                } else {
                    console.log("Pasa por aca para mostrar la carta");
                    setVisibleCardPoints(card.points);

                    setFrontCardVisibilityP1("visible");
                    let path: string = 'url("' + imagePath + card.denomination + ".png" + '")';

                    setFrontCardImageP1(path);


                    const player_card = {
                        is_card_visible: true,
                        player_hand_id: myHandID,
                        card_id: card.id
                    };
                    axios.post("http://localhost:3000/player_cards", { player_card });

                    axios.get("http://localhost:3000/player_hands/" + myHandID + "?")
                        .then(player_hand_response => {
                            let sum: number = player_hand_response.data.player_hand.total_points + cardPoints;
                            setTotalCardPoints(sum);
                            console.log("La suma de puntos es " + sum);

                            const player_hand = {
                                total_points: sum
                            };
                            axios.put("http://localhost:3000/player_hands/" + myHandID + "?", { player_hand });
                            //Si se pasa de 7 y medio
                            if (sum > 7.5) {
                                finishTurn();
                                setTimeout(() => {
                                    hideBetFromTable();
                                    hideChosenCardsFromTable();
                                }, 2000);

                            }
                        });


                }

            });





    }

    function bet() {
        console.log("Hago la apuesta con RoundID = " + roundID + " y player_id=" + playerID);
        const player_bet = {
            chips100_amount: chipsbet[0],
            chips250_amount: chipsbet[1],
            chips500_amount: chipsbet[2],
            chips1k_amount: chipsbet[3],
            chips5k_amount: chipsbet[4],
            total: totalBetP1,
            player_id: playerID,
            round_id: roundID
        };

        axios.post("http://localhost:3000/player_bets", { player_bet })


    }
    function hideChosenCardsFromTable() {
        setFrontCardVisibilityP1("hidden");
        setHiddenCardVisibilityP1("hidden");
    }
    function hideBetFromTable() {
        let newChipsBet = [...chipsbet];
        newChipsBet.fill(0);
        setChipsBet(newChipsBet);
        let newChipsVisibilityP1 = [...chipsVisibilityP1];
        newChipsVisibilityP1.fill("hidden");
        setChipsVisibilityP1(newChipsVisibilityP1);
    }
    function plant() {
        finishTurn();
        setTimeout(() => {
            hideBetFromTable();
            hideChosenCardsFromTable();
        }, 2000);
    }

    function setInitialStateOfGame() {


        let newBankVisibility = [...bankVisibility];
        newBankVisibility[0] = "visible";
        setBankVisibility(newBankVisibility);
        setIsBanker(true);

    }
    function login(name: string, pass: string) {

        let player = createPlayer(name);

        setLoginVisibility("hidden");
        setCreateOrJoinVisibility("visible");
    }

    function refreshPlayersState(sessionID: number) {


        axios.get('http://localhost:3000/sessions/' + sessionID + '?')
            .then(session => {
                for (let i = 0; i < session.data.rounds.length; i++) {
                    if (session.data.rounds[i].is_current_round) {
                        bank = session.data.rounds[i].bank;
                        if (session.data.rounds[i].current_turn !== playerName) {
                            //Obtengo el estado actual de mi tesoro
                            axios.get("http://localhost:3000/players/" + playerID + "?")
                                .then(myTreasure => {
                                    let newTreasureP1 = [...treasureP1];
                                    newTreasureP1[0] = myTreasure.data.treasure.chips100_amount;
                                    newTreasureP1[1] = myTreasure.data.treasure.chips250_amount;
                                    newTreasureP1[2] = myTreasure.data.treasure.chips500_amount;
                                    newTreasureP1[3] = myTreasure.data.treasure.chips1k_amount;
                                    newTreasureP1[4] = myTreasure.data.treasure.chips5k_amount;
                                    setTreasureP1(newTreasureP1);

                                    setTotalTreasure(myTreasure.data.treasure.total);
                                });
                        }

                    }
                }
                switch (session.data.players.length) {

                    case 2:
                        for (let i = 0; i < session.data.players.length; i++) {
                            if (session.data.players_session[i].position_in_board !== positionInBoard) {

                                if (session.data.players_session[i].position_in_board === 0) {

                                    axios.get('http://localhost:3000/players/' + session.data.players_session[i].player_id + '?')
                                        .then(player => {
                                            player4ID = player.data.player.id;
                                            let newTreasureP4 = [...treasureP4];
                                            newTreasureP4[0] = player.data.treasure.chips100_amount;
                                            newTreasureP4[1] = player.data.treasure.chips250_amount;
                                            newTreasureP4[2] = player.data.treasure.chips500_amount;
                                            newTreasureP4[3] = player.data.treasure.chips1k_amount;
                                            newTreasureP4[4] = player.data.treasure.chips5k_amount;
                                            setTreasureP4(newTreasureP4);

                                            setTotalTreasureP4(player.data.treasure.total);
                                            setPlayer4Name(player.data.player.name);


                                            let newChipsVisibilityP4 = [...chipsVisibilityP4];
                                            newChipsVisibilityP4.fill("visible");
                                            setChipsVisibilityP4(newChipsVisibilityP4);

                                            let newPlayersVisibility = [...playersVisibility];
                                            newPlayersVisibility[0] = "visible";
                                            newPlayersVisibility[3] = "visible";
                                            setPlayersVisibility(newPlayersVisibility);

                                            setPlayerOnTheLeft(player.data.player.name);

                                            

                                            //Obtengo las apuestas
                                            axios.get("http://localhost:3000/rounds/" + roundID + "?")
                                                .then(response => {
                                                    //console.log("Player 4 ID es: " + session.data.players_session[i].player_id+"y el que me guardo es"+player4ID);
                                                    for (let i = 0; i < response.data.player_bets.length; i++) {
                                                        if (response.data.player_bets[i].player_id === player4ID) {
                                                            let newChipsBetP4 = [...chipsbetP4];
                                                            newChipsBetP4[0] = response.data.player_bets[0].chips100_amount;
                                                            newChipsBetP4[1] = response.data.player_bets[0].chips250_amount;
                                                            newChipsBetP4[2] = response.data.player_bets[0].chips500_amount;
                                                            newChipsBetP4[3] = response.data.player_bets[0].chips1k_amount;
                                                            newChipsBetP4[4] = response.data.player_bets[0].chips5k_amount;
                                                            setChipsBetP4(newChipsBetP4);
                                                            setTotalBetP4(response.data.player_bets[0].total);
                                                        }
                                                    }
                                                    //Obtengo las cartas que se le han dado al player
                                                    for (let i = 0; i < response.data.player_hands.length; i++) {

                                                        if (response.data.player_hands[i].player_id === player4ID) {

                                                            axios.get("http://localhost:3000/player_hands/" + response.data.player_hands[i].id)
                                                                .then(player_hand => {
                                                                    if (player_hand.data.player_cards.length === 1 && hiddenCardVisibility[0] === "hidden") {
                                                                        let newHiddenCardsVisibility = [...hiddenCardVisibility];
                                                                        newHiddenCardsVisibility[2] = "visible";
                                                                        setHiddenCardVisibility(newHiddenCardsVisibility);
                                                                    }
                                                                    if (player_hand.data.player_cards.length > 1) {

                                                                        axios.get("http://localhost:3000/cards/" + player_hand.data.player_cards[player_hand.data.player_cards.length - 1].card_id)
                                                                            .then(card => {

                                                                                let card_denomination = card.data.card.denomination;
                                                                                let path: string = 'url("' + imagePath + card_denomination + ".png" + '")';
                                                                                setFrontCardImageP4(path);
                                                                                let newFrontCardsVisibility = [...frontCardVisibility];
                                                                                newFrontCardsVisibility[2] = "visible";
                                                                                setFrontCardVisibility(newFrontCardsVisibility);
                                                                            });
                                                                    }

                                                                });
                                                        }
                                                    }

                                                });


                                        });



                                }
                                if (session.data.players_session[i].position_in_board === 1) {
                                    axios.get('http://localhost:3000/players/' + session.data.players_session[i].player_id + '?')
                                        .then(player => {
                                            player2ID = player.data.player.id;
                                            let newTreasureP2 = [...treasureP2];
                                            newTreasureP2[0] = player.data.treasure.chips100_amount;
                                            newTreasureP2[1] = player.data.treasure.chips250_amount;
                                            newTreasureP2[2] = player.data.treasure.chips500_amount;
                                            newTreasureP2[3] = player.data.treasure.chips1k_amount;
                                            newTreasureP2[4] = player.data.treasure.chips5k_amount;
                                            setTreasureP2(newTreasureP2);

                                            setTotalTreasureP2(player.data.treasure.total);


                                            setPlayer2Name(player.data.player.name);

                                            let newPlayersVisibility = [...playersVisibility];
                                            newPlayersVisibility[0] = "visible";
                                            newPlayersVisibility[1] = "visible";
                                            setPlayersVisibility(newPlayersVisibility);

                                            let newChipsVisibilityP2 = [...chipsVisibilityP2];
                                            newChipsVisibilityP2.fill("visible");
                                            setChipsVisibilityP2(newChipsVisibilityP2);



                                            setFeedbackP2("Playing");

                                            setPlayerOnTheLeft(player.data.player.name);

                                            //Obtengo las apuestas
                                            axios.get("http://localhost:3000/rounds/" + roundID + "?")
                                                .then(response => {
                                                    //console.log("Player 2 ID es: " + session.data.players_session[i].player_id+"y el que me guardo es " +player2ID);
                                                    for (let i = 0; i < response.data.player_bets.length; i++) {
                                                        if (response.data.player_bets[i].player_id === player2ID) {
                                                            let newChipsBetP2 = [...chipsbetP2];
                                                            newChipsBetP2[0] = response.data.player_bets[0].chips100_amount;
                                                            newChipsBetP2[1] = response.data.player_bets[0].chips250_amount;
                                                            newChipsBetP2[2] = response.data.player_bets[0].chips500_amount;
                                                            newChipsBetP2[3] = response.data.player_bets[0].chips1k_amount;
                                                            newChipsBetP2[4] = response.data.player_bets[0].chips5k_amount;
                                                            setChipsBetP2(newChipsBetP2);
                                                            setTotalBetP2(response.data.player_bets[0].total);
                                                        }
                                                    }
                                                    //Obtengo las cartas que se le han dado al player
                                                    for (let i = 0; i < response.data.player_hands.length; i++) {

                                                        if (response.data.player_hands[i].player_id === player2ID) {

                                                            axios.get("http://localhost:3000/player_hands/" + response.data.player_hands[i].id)
                                                                .then(player_hand => {
                                                                    if (player_hand.data.player_cards.length === 1 && hiddenCardVisibility[0] === "hidden") {
                                                                        let newHiddenCardsVisibility = [...hiddenCardVisibility];
                                                                        newHiddenCardsVisibility[0] = "visible";
                                                                        setHiddenCardVisibility(newHiddenCardsVisibility);
                                                                    }
                                                                    if (player_hand.data.player_cards.length > 1) {

                                                                        axios.get("http://localhost:3000/cards/" + player_hand.data.player_cards[player_hand.data.player_cards.length - 1].card_id)
                                                                            .then(card => {

                                                                                let card_denomination = card.data.card.denomination;
                                                                                let path: string = 'url("' + imagePath + card_denomination + ".png" + '")';
                                                                                setFrontCardImageP2(path);
                                                                                let newFrontCardsVisibility = [...frontCardVisibility];
                                                                                newFrontCardsVisibility[0] = "visible";
                                                                                setFrontCardVisibility(newFrontCardsVisibility);
                                                                            });
                                                                    }

                                                                });
                                                        }
                                                    }
                                                });
                                        });

                                }
                            }

                        }

                        break;
                    case 3:
                        if (positionInBoard === 0) {
                            for (let i = 0; i < session.data.players.length; i++) {
                                //Soy el player 1| y debo las posiciones 2 y 3
                                if (session.data.players_session[i].position_in_board === 1) {

                                    axios.get('http://localhost:3000/players/' + session.data.players_session[i].player_id + '?')
                                        .then(player => {
                                            setPlayerOnTheLeft(player.data.player.name);
                                            player2ID = player.data.player.id;
                                            let newTreasureP2 = [...treasureP2];
                                            newTreasureP2[0] = player.data.treasure.chips100_amount;
                                            newTreasureP2[1] = player.data.treasure.chips250_amount;
                                            newTreasureP2[2] = player.data.treasure.chips500_amount;
                                            newTreasureP2[3] = player.data.treasure.chips1k_amount;
                                            newTreasureP2[4] = player.data.treasure.chips5k_amount;
                                            setTreasureP2(newTreasureP2);

                                            setTotalTreasureP2(player.data.treasure.total);


                                            setPlayer2Name(player.data.player.name);





                                            let newChipsVisibilityP2 = [...chipsVisibilityP2];
                                            newChipsVisibilityP2.fill("visible");
                                            setChipsVisibilityP2(newChipsVisibilityP2);


                                            setFeedbackP2("Playing");



                                            //Obtengo las apuestas
                                            axios.get("http://localhost:3000/rounds/" + roundID + "?")
                                                .then(response => {
                                                    //console.log("Player 2 ID es: " + session.data.players_session[i].player_id+"y el que me guardo es " +player2ID);
                                                    for (let i = 0; i < response.data.player_bets.length; i++) {
                                                        if (response.data.player_bets[i].player_id === player2ID) {
                                                            let newChipsBetP2 = [...chipsbetP2];
                                                            newChipsBetP2[0] = response.data.player_bets[i].chips100_amount;
                                                            newChipsBetP2[1] = response.data.player_bets[i].chips250_amount;
                                                            newChipsBetP2[2] = response.data.player_bets[i].chips500_amount;
                                                            newChipsBetP2[3] = response.data.player_bets[i].chips1k_amount;
                                                            newChipsBetP2[4] = response.data.player_bets[i].chips5k_amount;
                                                            setChipsBetP2(newChipsBetP2);
                                                            setTotalBetP2(response.data.player_bets[0].total);
                                                        }
                                                    }
                                                    //Obtengo las cartas que se le han dado al player
                                                    for (let i = 0; i < response.data.player_hands.length; i++) {

                                                        if (response.data.player_hands[i].player_id === player2ID) {

                                                            axios.get("http://localhost:3000/player_hands/" + response.data.player_hands[i].id)
                                                                .then(player_hand => {

                                                                    if (player_hand.data.player_cards.length > 1) {

                                                                        axios.get("http://localhost:3000/cards/" + player_hand.data.player_cards[player_hand.data.player_cards.length - 1].card_id)
                                                                            .then(card => {

                                                                                let card_denomination = card.data.card.denomination;
                                                                                let path: string = 'url("' + imagePath + card_denomination + ".png" + '")';
                                                                                setFrontCardImageP2(path);

                                                                            });
                                                                    }

                                                                });
                                                        }
                                                    }
                                                });
                                        });

                                }
                                if (session.data.players_session[i].position_in_board === 2) {
                                    axios.get('http://localhost:3000/players/' + session.data.players_session[i].player_id + '?')
                                        .then(player => {
                                            player3ID = player.data.player.id;

                                            let newTreasureP3 = [...treasureP3];
                                            newTreasureP3[0] = player.data.treasure.chips100_amount;
                                            newTreasureP3[1] = player.data.treasure.chips250_amount;
                                            newTreasureP3[2] = player.data.treasure.chips500_amount;
                                            newTreasureP3[3] = player.data.treasure.chips1k_amount;
                                            newTreasureP3[4] = player.data.treasure.chips5k_amount;
                                            setTreasureP3(newTreasureP3);

                                            setTotalTreasureP3(player.data.treasure.total);


                                            setPlayer3Name(player.data.player.name);

                                            let newChipsVisibilityP3 = [...chipsVisibilityP3];
                                            newChipsVisibilityP3.fill("visible");
                                            setChipsVisibilityP3(newChipsVisibilityP3);



                                            setFeedbackP3("Waiting");



                                            //Obtengo las apuestas
                                            axios.get("http://localhost:3000/rounds/" + roundID + "?")
                                                .then(response => {
                                                    //console.log("Player 2 ID es: " + session.data.players_session[i].player_id+"y el que me guardo es " +player2ID);
                                                    for (let i = 0; i < response.data.player_bets.length; i++) {
                                                        if (response.data.player_bets[i].player_id === player3ID) {

                                                            let newChipsBetP3 = [...chipsbetP3];
                                                            newChipsBetP3[0] = response.data.player_bets[i].chips100_amount;
                                                            newChipsBetP3[1] = response.data.player_bets[i].chips250_amount;
                                                            newChipsBetP3[2] = response.data.player_bets[i].chips500_amount;
                                                            newChipsBetP3[3] = response.data.player_bets[i].chips1k_amount;
                                                            newChipsBetP3[4] = response.data.player_bets[i].chips5k_amount;
                                                            setChipsBetP3(newChipsBetP3);
                                                            setTotalBetP3(response.data.player_bets[0].total);
                                                        }
                                                    }
                                                    //Obtengo las cartas que se le han dado al player
                                                    for (let i = 0; i < response.data.player_hands.length; i++) {

                                                        if (response.data.player_hands[i].player_id === player3ID) {

                                                            axios.get("http://localhost:3000/player_hands/" + response.data.player_hands[i].id)
                                                                .then(player_hand => {

                                                                    if (player_hand.data.player_cards.length > 1) {

                                                                        axios.get("http://localhost:3000/cards/" + player_hand.data.player_cards[player_hand.data.player_cards.length - 1].card_id)
                                                                            .then(card => {

                                                                                let card_denomination = card.data.card.denomination;
                                                                                let path: string = 'url("' + imagePath + card_denomination + ".png" + '")';
                                                                                setFrontCardImageP3(path);

                                                                            });
                                                                    }

                                                                });
                                                        }
                                                    }
                                                });
                                        });

                                }




                            }

                            let newHiddenCardsVisibility = [...hiddenCardVisibility];
                            newHiddenCardsVisibility[0] = "visible";
                            newHiddenCardsVisibility[1] = "visible";
                            setHiddenCardVisibility(newHiddenCardsVisibility);

                            let newFrontCardsVisibility = [...frontCardVisibility];
                            newFrontCardsVisibility[0] = "visible";
                            newFrontCardsVisibility[1] = "visible";
                            setFrontCardVisibility(newFrontCardsVisibility);

                            let newPlayersVisibility = [...playersVisibility];
                            newPlayersVisibility[1] = "visible";
                            newPlayersVisibility[0] = "visible";
                            newPlayersVisibility[2] = "visible";
                            setPlayersVisibility(newPlayersVisibility);
                        }
                        if (positionInBoard === 1) {
                            //SOy el player 2 y debo renderizar las posiciones 2 y 4
                            for (let i = 0; i < session.data.players.length; i++) {
                                if (session.data.players_session[i].position_in_board === 2) {
                                    axios.get('http://localhost:3000/players/' + session.data.players_session[i].player_id + '?')
                                        .then(player => {
                                            player2ID = player.data.player.id;
                                            let newTreasureP2 = [...treasureP2];
                                            newTreasureP2[0] = player.data.treasure.chips100_amount;
                                            newTreasureP2[1] = player.data.treasure.chips250_amount;
                                            newTreasureP2[2] = player.data.treasure.chips500_amount;
                                            newTreasureP2[3] = player.data.treasure.chips1k_amount;
                                            newTreasureP2[4] = player.data.treasure.chips5k_amount;
                                            setTreasureP2(newTreasureP2);

                                            setTotalTreasureP2(player.data.treasure.total);


                                            setPlayer2Name(player.data.player.name);





                                            let newChipsVisibilityP2 = [...chipsVisibilityP2];
                                            newChipsVisibilityP2.fill("visible");
                                            setChipsVisibilityP2(newChipsVisibilityP2);



                                            setFeedbackP2("Playing");

                                            setPlayerOnTheLeft(player.data.player.name);

                                            //Obtengo las apuestas
                                            axios.get("http://localhost:3000/rounds/" + roundID + "?")
                                                .then(response => {
                                                    //console.log("Player 2 ID es: " + session.data.players_session[i].player_id+"y el que me guardo es " +player2ID);
                                                    for (let i = 0; i < response.data.player_bets.length; i++) {
                                                        if (response.data.player_bets[i].player_id === player2ID) {
                                                            let newChipsBetP2 = [...chipsbetP2];
                                                            newChipsBetP2[0] = response.data.player_bets[i].chips100_amount;
                                                            newChipsBetP2[1] = response.data.player_bets[i].chips250_amount;
                                                            newChipsBetP2[2] = response.data.player_bets[i].chips500_amount;
                                                            newChipsBetP2[3] = response.data.player_bets[i].chips1k_amount;
                                                            newChipsBetP2[4] = response.data.player_bets[i].chips5k_amount;
                                                            setChipsBetP2(newChipsBetP2);
                                                            setTotalBetP2(response.data.player_bets[0].total);
                                                        }
                                                    }
                                                    //Obtengo las cartas que se le han dado al player
                                                    for (let i = 0; i < response.data.player_hands.length; i++) {

                                                        if (response.data.player_hands[i].player_id === player2ID) {

                                                            axios.get("http://localhost:3000/player_hands/" + response.data.player_hands[i].id)
                                                                .then(player_hand => {

                                                                    if (player_hand.data.player_cards.length > 1) {

                                                                        axios.get("http://localhost:3000/cards/" + player_hand.data.player_cards[player_hand.data.player_cards.length - 1].card_id)
                                                                            .then(card => {

                                                                                let card_denomination = card.data.card.denomination;
                                                                                let path: string = 'url("' + imagePath + card_denomination + ".png" + '")';
                                                                                setFrontCardImageP2(path);

                                                                            });
                                                                    }

                                                                });
                                                        }
                                                    }
                                                });
                                        });

                                }

                                if (session.data.players_session[i].position_in_board === 0) {

                                    axios.get('http://localhost:3000/players/' + session.data.players_session[i].player_id + '?')
                                        .then(player => {
                                            player4ID = player.data.player.id;
                                            let newTreasureP4 = [...treasureP4];
                                            newTreasureP4[0] = player.data.treasure.chips100_amount;
                                            newTreasureP4[1] = player.data.treasure.chips250_amount;
                                            newTreasureP4[2] = player.data.treasure.chips500_amount;
                                            newTreasureP4[3] = player.data.treasure.chips1k_amount;
                                            newTreasureP4[4] = player.data.treasure.chips5k_amount;
                                            setTreasureP4(newTreasureP4);

                                            setTotalTreasureP4(player.data.treasure.total);
                                            setPlayer4Name(player.data.player.name);


                                            let newChipsVisibilityP4 = [...chipsVisibilityP4];
                                            newChipsVisibilityP4.fill("visible");
                                            setChipsVisibilityP4(newChipsVisibilityP4);





                                            //Obtengo las apuestas
                                            axios.get("http://localhost:3000/rounds/" + roundID + "?")
                                                .then(response => {
                                                    //console.log("Player 4 ID es: " + session.data.players_session[i].player_id+"y el que me guardo es"+player4ID);
                                                    for (let i = 0; i < response.data.player_bets.length; i++) {
                                                        if (response.data.player_bets[i].player_id === player4ID) {
                                                            let newChipsBetP4 = [...chipsbetP4];
                                                            newChipsBetP4[0] = response.data.player_bets[i].chips100_amount;
                                                            newChipsBetP4[1] = response.data.player_bets[i].chips250_amount;
                                                            newChipsBetP4[2] = response.data.player_bets[i].chips500_amount;
                                                            newChipsBetP4[3] = response.data.player_bets[i].chips1k_amount;
                                                            newChipsBetP4[4] = response.data.player_bets[i].chips5k_amount;
                                                            setChipsBetP4(newChipsBetP4);
                                                            setTotalBetP4(response.data.player_bets[0].total);
                                                        }
                                                    }
                                                    //Obtengo las cartas que se le han dado al player
                                                    for (let i = 0; i < response.data.player_hands.length; i++) {

                                                        if (response.data.player_hands[i].player_id === player4ID) {

                                                            axios.get("http://localhost:3000/player_hands/" + response.data.player_hands[i].id)
                                                                .then(player_hand => {

                                                                    if (player_hand.data.player_cards.length > 1) {

                                                                        axios.get("http://localhost:3000/cards/" + player_hand.data.player_cards[player_hand.data.player_cards.length - 1].card_id)
                                                                            .then(card => {

                                                                                let card_denomination = card.data.card.denomination;
                                                                                let path: string = 'url("' + imagePath + card_denomination + ".png" + '")';
                                                                                setFrontCardImageP4(path);

                                                                            });
                                                                    }

                                                                });
                                                        }
                                                    }

                                                });


                                        });



                                }


                            }


                            let newHiddenCardsVisibility = [...hiddenCardVisibility];
                            newHiddenCardsVisibility[0] = "visible";
                            newHiddenCardsVisibility[2] = "visible";
                            setHiddenCardVisibility(newHiddenCardsVisibility);

                            let newFrontCardsVisibility = [...frontCardVisibility];
                            newFrontCardsVisibility[0] = "visible";
                            newFrontCardsVisibility[2] = "visible";
                            setFrontCardVisibility(newFrontCardsVisibility);

                            let newPlayersVisibility = [...playersVisibility];
                            newPlayersVisibility[0] = "visible";
                            newPlayersVisibility[1] = "visible";
                            newPlayersVisibility[3] = "visible";
                            setPlayersVisibility(newPlayersVisibility);
                        }
                        if (positionInBoard === 2) {
                            //Soy el player 3 y debo renderizar las posiciones 3 y 4
                            for (let i = 0; i < session.data.players.length; i++) {

                                if (session.data.players_session[i].position_in_board === 0) {

                                    axios.get('http://localhost:3000/players/' + session.data.players_session[i].player_id + '?')
                                        .then(player => {
                                            player3ID = player.data.player.id;
                                            let newTreasureP3 = [...treasureP3];
                                            newTreasureP3[0] = player.data.treasure.chips100_amount;
                                            newTreasureP3[1] = player.data.treasure.chips250_amount;
                                            newTreasureP3[2] = player.data.treasure.chips500_amount;
                                            newTreasureP3[3] = player.data.treasure.chips1k_amount;
                                            newTreasureP3[4] = player.data.treasure.chips5k_amount;
                                            setTreasureP3(newTreasureP3);

                                            setTotalTreasureP3(player.data.treasure.total);
                                            setPlayer3Name(player.data.player.name);


                                            let newChipsVisibilityP3 = [...chipsVisibilityP3];
                                            newChipsVisibilityP3.fill("visible");
                                            setChipsVisibilityP3(newChipsVisibilityP3);

                                            setPlayerOnTheLeft(player.data.player.name);

                                            //Obtengo las apuestas
                                            axios.get("http://localhost:3000/rounds/" + roundID + "?")
                                                .then(response => {
                                                    //console.log("Player 4 ID es: " + session.data.players_session[i].player_id+"y el que me guardo es"+player4ID);
                                                    for (let i = 0; i < response.data.player_bets.length; i++) {
                                                        if (response.data.player_bets[i].player_id === player3ID) {
                                                            let newChipsBetP3 = [...chipsbetP3];
                                                            newChipsBetP3[0] = response.data.player_bets[i].chips100_amount;
                                                            newChipsBetP3[1] = response.data.player_bets[i].chips250_amount;
                                                            newChipsBetP3[2] = response.data.player_bets[i].chips500_amount;
                                                            newChipsBetP3[3] = response.data.player_bets[i].chips1k_amount;
                                                            newChipsBetP3[4] = response.data.player_bets[i].chips5k_amount;
                                                            setChipsBetP3(newChipsBetP3);
                                                            setTotalBetP3(response.data.player_bets[0].total);
                                                        }
                                                    }
                                                    //Obtengo las cartas que se le han dado al player
                                                    for (let i = 0; i < response.data.player_hands.length; i++) {

                                                        if (response.data.player_hands[i].player_id === player3ID) {

                                                            axios.get("http://localhost:3000/player_hands/" + response.data.player_hands[i].id)
                                                                .then(player_hand => {

                                                                    if (player_hand.data.player_cards.length > 1) {

                                                                        axios.get("http://localhost:3000/cards/" + player_hand.data.player_cards[player_hand.data.player_cards.length - 1].card_id)
                                                                            .then(card => {

                                                                                let card_denomination = card.data.card.denomination;
                                                                                let path: string = 'url("' + imagePath + card_denomination + ".png" + '")';
                                                                                setFrontCardImageP3(path);

                                                                            });
                                                                    }

                                                                });
                                                        }
                                                    }

                                                });


                                        });



                                }
                                if (session.data.players_session[i].position_in_board === 1) {
                                    axios.get('http://localhost:3000/players/' + session.data.players_session[i].player_id + '?')
                                        .then(player => {
                                            player4ID = player.data.player.id;
                                            let newTreasureP4 = [...treasureP4];
                                            newTreasureP4[0] = player.data.treasure.chips100_amount;
                                            newTreasureP4[1] = player.data.treasure.chips250_amount;
                                            newTreasureP4[2] = player.data.treasure.chips500_amount;
                                            newTreasureP4[3] = player.data.treasure.chips1k_amount;
                                            newTreasureP4[4] = player.data.treasure.chips5k_amount;
                                            setTreasureP4(newTreasureP4);

                                            setTotalTreasureP4(player.data.treasure.total);


                                            setPlayer4Name(player.data.player.name);


                                            let newChipsVisibilityP4 = [...chipsVisibilityP2];
                                            newChipsVisibilityP4.fill("visible");
                                            setChipsVisibilityP4(newChipsVisibilityP4);



                                            setFeedbackP4("Waiting");


                                            //Obtengo las apuestas
                                            axios.get("http://localhost:3000/rounds/" + roundID + "?")
                                                .then(response => {
                                                    //console.log("Player 2 ID es: " + session.data.players_session[i].player_id+"y el que me guardo es " +player2ID);
                                                    for (let i = 0; i < response.data.player_bets.length; i++) {
                                                        if (response.data.player_bets[i].player_id === player4ID) {
                                                            let newChipsBetP4 = [...chipsbetP4];
                                                            newChipsBetP4[0] = response.data.player_bets[0].chips100_amount;
                                                            newChipsBetP4[1] = response.data.player_bets[0].chips250_amount;
                                                            newChipsBetP4[2] = response.data.player_bets[0].chips500_amount;
                                                            newChipsBetP4[3] = response.data.player_bets[0].chips1k_amount;
                                                            newChipsBetP4[4] = response.data.player_bets[0].chips5k_amount;
                                                            setChipsBetP4(newChipsBetP4);
                                                            setTotalBetP4(response.data.player_bets[0].total);
                                                        }
                                                    }
                                                    //Obtengo las cartas que se le han dado al player
                                                    for (let i = 0; i < response.data.player_hands.length; i++) {

                                                        if (response.data.player_hands[i].player_id === player4ID) {

                                                            axios.get("http://localhost:3000/player_hands/" + response.data.player_hands[i].id)
                                                                .then(player_hand => {

                                                                    if (player_hand.data.player_cards.length > 1) {

                                                                        axios.get("http://localhost:3000/cards/" + player_hand.data.player_cards[player_hand.data.player_cards.length - 1].card_id)
                                                                            .then(card => {

                                                                                let card_denomination = card.data.card.denomination;
                                                                                let path: string = 'url("' + imagePath + card_denomination + ".png" + '")';
                                                                                setFrontCardImageP4(path);

                                                                            });
                                                                    }

                                                                });
                                                        }
                                                    }
                                                });
                                        });

                                }



                            }


                            let newHiddenCardsVisibility = [...hiddenCardVisibility];
                            newHiddenCardsVisibility[1] = "visible";
                            newHiddenCardsVisibility[2] = "visible";
                            setHiddenCardVisibility(newHiddenCardsVisibility);

                            let newFrontCardsVisibility = [...frontCardVisibility];
                            newFrontCardsVisibility[2] = "visible";
                            newFrontCardsVisibility[1] = "visible";
                            setFrontCardVisibility(newFrontCardsVisibility);

                            let newPlayersVisibility = [...playersVisibility];
                            newPlayersVisibility[0] = "visible";
                            newPlayersVisibility[2] = "visible";
                            newPlayersVisibility[3] = "visible";
                            setPlayersVisibility(newPlayersVisibility);
                        }

                        break;
                    case 4:
                        break;
                }
            });



    }


    function createGame() {
        setCreateOrJoinVisibility("hidden");
        setGameBoardVisibility("visible");
        toggleActions(false, true, false);



        axios.get('http://localhost:3000/players/' + playerID + '?')
            .then(response => {


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
                            position_in_board: 0
                        };
                        positionInBoard = 0;

                        setCurrentSessionID(session_response.data.session.id);
                        sessionID = session_response.data.session.id;
                        console.log("Current session ID: " + sessionID);
                        axios.post('http://localhost:3000/player_sessions', { player_session });

                        const round = {
                            bank: playerName,
                            is_current_round: true,
                            previous_turn: "",
                            current_turn: "",
                            next_turn: "",
                            session_id: session_response.data.session.id
                        };
                        axios.post('http://localhost:3000/rounds', { round })
                            .then(round => {
                                setCurrentRoundID(round.data.round.id);
                                roundID = round.data.round.id;
                            })
                    }

                    )


            })


        setInitialStateOfGame();
        setInterval(() => {
            refreshPlayersState(sessionID);
            checkForTurn();

        }, 1000);

    }
    function joinGame(session_id: number) {
        setCreateOrJoinVisibility("hidden");
        setGameBoardVisibility("visible");
        toggleActions(true, false, true)

        sessionID = session_id;
        axios.get('http://localhost:3000/sessions/' + session_id + '?')
            .then(session_response => {




                switch (session_response.data.players.length) {

                    case 1: {
                        //Unirse a partida
                        const player_session = {
                            player_id: playerID,
                            session_id: session_id,
                            position_in_board: 1
                        };
                        positionInBoard = 1;
                        axios.post('http://localhost:3000/player_sessions', { player_session });

                        //Obtengo datos del player nuevo.
                        axios.get('http://localhost:3000/players/' + playerID + '?')
                            .then(player_responseP1 => {



                                let newTreasureP1 = [...treasureP1];
                                newTreasureP1[0] = player_responseP1.data.treasure.chips100_amount;
                                newTreasureP1[1] = player_responseP1.data.treasure.chips250_amount;
                                newTreasureP1[2] = player_responseP1.data.treasure.chips500_amount;
                                newTreasureP1[3] = player_responseP1.data.treasure.chips1k_amount;
                                newTreasureP1[4] = player_responseP1.data.treasure.chips5k_amount;
                                setTreasureP1(newTreasureP1);
                                setTotalTreasure(player_responseP1.data.treasure.total);

                                setIsBanker(false);
                                

                                let newBankVisibility = [...bankVisibility];
                                newBankVisibility[3] = "visible";
                                setBankVisibility(newBankVisibility);

                            });

                        //Actualizo la ronda actual para darle el turno al player que se une.
                        for (let i = 0; i < session_response.data.rounds.length; i++) {
                            if (session_response.data.rounds[i].is_current_round) {
                                const roundUpdated = {
                                    current_turn: playerName
                                };

                                axios.put("http://localhost:3000/rounds/" + session_response.data.rounds[i].id + "?", roundUpdated)
                                    .then(round => {
                                        roundID = round.data.round.id;
                                        setCurrentRoundID(round.data.round.id);

                                    });
                            }
                        }

                        //Muestro el otro player
                        for (let i = 0; i < session_response.data.players.length; i++) {
                            if (session_response.data.players_session[i].position_in_board === 0) {
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP4 => {
                                        player4ID = session_response.data.players_session[i].player_id;

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
                            position_in_board: 2
                        };
                        positionInBoard = 2
                        axios.post('http://localhost:3000/player_sessions', { player_session });

                        //Obtengo datos del player nuevo.
                        axios.get('http://localhost:3000/players/' + playerID + '?')
                            .then(player_responseP1 => {



                                let newTreasureP1 = [...treasureP1];
                                newTreasureP1[0] = player_responseP1.data.treasure.chips100_amount;
                                newTreasureP1[1] = player_responseP1.data.treasure.chips250_amount;
                                newTreasureP1[2] = player_responseP1.data.treasure.chips500_amount;
                                newTreasureP1[3] = player_responseP1.data.treasure.chips1k_amount;
                                newTreasureP1[4] = player_responseP1.data.treasure.chips5k_amount;
                                setTreasureP1(newTreasureP1);
                                setTotalTreasure(player_responseP1.data.treasure.total);

                                setIsBanker(false);



                            });

                        //Actualizo la ronda actual para darle el turno al player que se une.
                        for (let i = 0; i < session_response.data.rounds.length; i++) {
                            if (session_response.data.rounds[i].is_current_round) {
                                roundID = session_response.data.rounds[i].id;
                                setCurrentRoundID(session_response.data.rounds[i].id);

                            }
                        }

                        //Muestro el otro player
                        for (let i = 0; i < session_response.data.players.length; i++) {
                            if (session_response.data.players_session[i].position_in_board === 0) {
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP3 => {

                                        player3ID = session_response.data.players_session[i].player_id;
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
                            if (session_response.data.players_session[i].position_in_board === 1) {
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP4 => {

                                        player4ID = session_response.data.players_session[i].player_id;
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
                        let newBankVisibility = [...bankVisibility];
                        newBankVisibility[2] = "visible";
                        setBankVisibility(newBankVisibility);
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
                            position_in_board: 3
                        };
                        positionInBoard = 3;
                        axios.post('http://localhost:3000/player_sessions', { player_session });

                        //Obtengo datos del player nuevo.
                        axios.get('http://localhost:3000/players/' + playerID + '?')
                            .then(player_responseP1 => {



                                let newTreasureP1 = [...treasureP1];
                                newTreasureP1[0] = player_responseP1.data.treasure.chips100_amount;
                                newTreasureP1[1] = player_responseP1.data.treasure.chips250_amount;
                                newTreasureP1[2] = player_responseP1.data.treasure.chips500_amount;
                                newTreasureP1[3] = player_responseP1.data.treasure.chips1k_amount;
                                newTreasureP1[4] = player_responseP1.data.treasure.chips5k_amount;
                                setTreasureP1(newTreasureP1);
                                setTotalTreasure(player_responseP1.data.treasure.total);

                                setIsBanker(false);



                            });

                        //Muestro el otro player
                        for (let i = 0; i < session_response.data.players.length; i++) {
                            if (session_response.data.players_session[i].position_in_board === 0) {
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP2 => {

                                        player2ID = session_response.data.players_session[i].player_id;
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
                            if (session_response.data.players_session[i].position_in_board === 1) {
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP3 => {

                                        player3ID = session_response.data.players_session[i].player_id;
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
                            if (session_response.data.players_session[i].position_in_board === 2) {
                                axios.get('http://localhost:3000/players/' + session_response.data.players_session[i].player_id + '?')
                                    .then(player_responseP4 => {

                                        player4ID = session_response.data.players_session[i].player_id;
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
        setInterval(() => {
            refreshPlayersState(currentSessionID);
            checkForTurn();

        }, 1000);
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
            <label>Round ID: {currentRoundID}</label>
            <label>Hand ID: {myHandID}</label>
            <label>Player ID: {playerID}</label>


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
                        <input type="password" placeholder='your password' />
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
                            <label>{feedbackP3}</label>
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
                            <div className='bank' style={{ visibility: bankVisibility[2] }}>
                                <label>BANK</label>
                            </div>
                        </div>

                        <div className='grid-item' style={{ visibility: hiddenCardVisibility[1] }}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item' style={{ visibility: frontCardVisibility[1] }}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-front' style={{ backgroundImage: frontCardImageP3 }}>

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
                            <label>{feedbackP2}</label>
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
                            <div className='bank' style={{ visibility: bankVisibility[1] }}>
                                <label>BANK</label>
                            </div>
                        </div>

                        <div className='grid-item' style={{ visibility: hiddenCardVisibility[0] }}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item' style={{ visibility: frontCardVisibility[0] }}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-front' style={{ backgroundImage: frontCardImageP2 }}>

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
                            <label>{feedbackP4}</label>
                        </div>
                    </div>

                    <div className='grid-apuesta-container'>
                        <div className='grid-item1-apuesta' style={{ visibility: chipsVisibilityP4[0] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/100.png")' }}>

                            </div>
                            <label>{chipsbetP4[0]}</label>
                        </div>
                        <div className='grid-item2-apuesta' style={{ visibility: chipsVisibilityP4[1] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/250.png")' }}>

                            </div>
                            <label>{chipsbetP4[1]}</label>
                        </div>
                        <div className='grid-item3-apuesta' style={{ visibility: chipsVisibilityP4[2] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/500.png")' }}>

                            </div>
                            <label>{chipsbetP4[2]}</label>
                        </div>
                        <div className='grid-item4-apuesta' style={{ visibility: chipsVisibilityP4[3] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/1000.png")' }}>

                            </div>
                            <label>{chipsbetP4[3]}</label>
                        </div>
                        <div className='grid-item5-apuesta' style={{ visibility: chipsVisibilityP4[4] }}>
                            <div className='chip' style={{ backgroundImage: 'url("img/chips/5000.png")' }}>

                            </div>
                            <label>{chipsbetP4[4]}</label>
                        </div>
                    </div>



                    <div className='grid-container-x4'>
                        <div className='user-profile' style={{ transform: "rotate(180deg)" }}>
                            <label style={{ position: "relative", top: "50px" }}>{player4Name}</label>
                            <div className='bank' style={{ visibility: bankVisibility[3] }}>
                                <label>BANK</label>
                            </div>
                        </div>

                        <div className='grid-item' style={{ visibility: hiddenCardVisibility[2] }}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item' style={{ visibility: frontCardVisibility[2] }}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-front' style={{ backgroundImage: frontCardImageP4 }}>

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
                        <label>{feedbackP1}</label>
                    </div>

                    <div className='grid-apuesta-container'>
                        <div className='grid-item1-apuesta' style={{ visibility: chipsVisibilityP1[0] }}>
                            <button className='chip' disabled={chipsInteractable[0]} onClick={() => pickUpChipFromBet(0)} style={{ backgroundImage: 'url("img/chips/100.png")' }} />
                            <label>{chipsbet[0]}</label>
                        </div>
                        <div className='grid-item2-apuesta' style={{ visibility: chipsVisibilityP1[1] }}>
                            <button className='chip' disabled={chipsInteractable[1]} onClick={() => pickUpChipFromBet(1)} style={{ backgroundImage: 'url("img/chips/250.png")' }} />
                            <label>{chipsbet[1]}</label>
                        </div>
                        <div className='grid-item3-apuesta' style={{ visibility: chipsVisibilityP1[2] }}>
                            <button className='chip' disabled={chipsInteractable[2]} onClick={() => pickUpChipFromBet(2)} style={{ backgroundImage: 'url("img/chips/500.png")' }} />
                            <label>{chipsbet[2]}</label>
                        </div>
                        <div className='grid-item4-apuesta' style={{ visibility: chipsVisibilityP1[3] }}>
                            <button className='chip' disabled={chipsInteractable[3]} onClick={() => pickUpChipFromBet(3)} style={{ backgroundImage: 'url("img/chips/1000.png")' }} />
                            <label>{chipsbet[3]}</label>
                        </div>
                        <div className='grid-item5-apuesta' style={{ visibility: chipsVisibilityP1[4] }}>
                            <button className='chip' disabled={chipsInteractable[4]} onClick={() => pickUpChipFromBet(4)} style={{ backgroundImage: 'url("img/chips/5000.png")' }} />
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
                        <div className='grid-item' style={{ visibility: hiddenCardVisibilityP1 }}>
                            <div className='points-container'>
                                <label>{hiddenCardPoints}</label>
                            </div>
                            <div className='card-back'>

                            </div>

                        </div>
                        <div className='grid-item' style={{ visibility: frontCardVisibilityP1 }}>
                            <div className='points-container' style={{ visibility: "hidden" }}>
                                <label>5</label>
                            </div>
                            <div className='card-front' style={{ backgroundImage: frontCardImageP1 }}>

                            </div>
                        </div>
                        <div className='grid-item'>
                            <div className='points-container'>
                                <label>{totalCardPoints}</label>
                            </div>
                            <div className='menu-actions'>
                                <button className='action-button' disabled={actionsVisibility[0]} onClick={hit}>Hit</button>
                                <button className='action-button' disabled={actionsVisibility[1]} onClick={bet}>Bet</button>
                                <button className='action-button' disabled={actionsVisibility[2]} onClick={plant}>Plant</button>
                            </div>
                        </div>

                    </div>


                    <div className='grid-container'>
                        <div className='grid-item'>
                            <button className='chip' disabled={chipsInteractable[0]} onClick={() => handleClick(0)} style={{ backgroundImage: 'url("img/chips/100.png")' }} />
                            <label>{treasureP1[0]}</label>

                        </div>
                        <div className='grid-item'>
                            <button className='chip' disabled={chipsInteractable[1]} onClick={() => handleClick(1)} style={{ backgroundImage: 'url("img/chips/250.png")' }} />
                            <label>{treasureP1[1]}</label>
                        </div>
                        <div className='grid-item'>
                            <button className='chip' disabled={chipsInteractable[2]} onClick={() => handleClick(2)} style={{ backgroundImage: 'url("img/chips/500.png")' }} />
                            <label>{treasureP1[2]}</label>
                        </div>
                        <div className='grid-item'>
                            <button className='chip' disabled={chipsInteractable[3]} onClick={() => handleClick(3)} style={{ backgroundImage: 'url("img/chips/1000.png")' }} />
                            <label>{treasureP1[3]}</label>
                        </div>
                        <div className='grid-item'>
                            <button className='chip' disabled={chipsInteractable[4]} onClick={() => handleClick(4)} style={{ backgroundImage: 'url("img/chips/5000.png")' }} />
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