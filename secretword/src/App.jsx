// CSS
import './App.css'

// React
import { useCallback, useState } from 'react'

// data
import {wordsList} from "./data/words"

// Components
import StartScreen from './components/StartScreen'
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"},
];

function App() {
  //Controla o estágio do game com useState  
  const [gameStage, setGameStage] = useState(stages[0].name);
  //Controla estado de wordlist
  const [words] = useState(wordsList);

  //Debugger
  console.log(words);


  return (
    <div className="App">
      {/*Só vai aparecer a StartScreen se gameStage for 'start'*/}
      {gameStage === 'start' && <StartScreen />}
      {/*Só vai aparecer a Game se gameStage for 'start'*/}
      {gameStage === 'game' && <Game />}
      {/*Só vai aparecer a GameOver se gameStage for 'start'*/}
      {gameStage === 'end' && <GameOver />}

    </div>
  )
}

export default App
