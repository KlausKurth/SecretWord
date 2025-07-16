// CSS
import './App.css'

// React
import { useCallback, useEffect, useState } from 'react'

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

const guessesQty = 3

function App() {
  //Controla o estágio do game com useState  
  const [gameStage, setGameStage] = useState(stages[0].name);

  //Controla estado de wordlist
  const [words] = useState(wordsList);

  // tratar as palvras escolhidas
  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  //controla as letras adivinhadas
  const [guessedLetters, setGuessedLatters] = useState([])
  //controla as letras erradas
  const [wrongLetters, setWrongLetters] = useState([])
  //controla a quantidades de tentativas que o jogador vai ter
  const [guesses, setGuesses] = useState(guessesQty)
  //contrla a pontuação do jogador
  const [score, setScore] = useState(0)


  // Pegar uma categoria e palavra aleatória
  const pickWordAndCategory = () => {
    
    // pega o array de categorias do arquivo words.js
    const categories = Object.keys(words)
    // Math.random() gera um número aleatório entre 0 e 1
    // Multiplicamos esse número pelo tamanho do array de categorias com .length
    // Math.floor(...) arredonda o valor para baixo, transformando em um índice válido para acessar o array.
    // Exemplo : 
    // Math.random() * 6 // Suponha que dá 4.87
    // Math.floor(4.87)  // Vira 4
    // categories[4]     // Acessa a quinta categoria
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //Debugger
    //console.log(category)
    
    //pegar uma palavra aleatória
    const word = words[category][Math.floor(Math.random() * Object.keys(categories).length)]

    //Debugger
    //console.log(word)

    // Retornando o valor como objeto
    return {word, category}
  }

  // Função que inicia o jogo
  // stage 1 segundo estágio game
  const startGame = () => {
    // desestrutura como objeto o valor word category que recebe da função pickWordCategory()
    const {word, category} = pickWordAndCategory();

    // tranformar a palavra em letras
    let wordLetters = word.split("")

    //padronizar as letras em caixa baixa
    wordLetters = wordLetters.map((l) => l.toLowerCase());    

    // Alterar os estatdos das variaveis 
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)

    //Debugger
    //console.log(category)
    //console.log(word)
    //console.log(wordLetters)
    
    setGameStage(stages[1].name)


  }

  // processar a entrada da letra
  // stage 2 ultimo estágio game
  const verifyLetter = (letter) => {   
    //setGameStage(stages[2].name)

    //padroninzar a letra que o jogador inputa para caixa baixa
    const normalizedLetter = letter.toLowerCase()
    // validar se a letra ja foi utilizada
    // para o jogador nao correr o risco de perder chance atoa colocar a mesma palavra que ja usou
    if(
      guessedLetters.includes(normalizedLetter) || 
      wrongLetters.includes(normalizedLetter)
      ){
        return
      }
      
      // valide a letra adivinhada ou remova um chance do jogador
      // unindo um elemnto em uma arrav
      if(letters.includes(normalizedLetter)) {
        setGuessedLatters((actualGuessedLetters) => [
          ...actualGuessedLetters,
          normalizedLetter,
        ]);
      }else {
        setWrongLetters((actualWrongLetters) => [
          ...actualWrongLetters,
          normalizedLetter,
        ]);

        //condiçao para diminuir as chances do jogador
        setGuesses((actualGuesses) => actualGuesses -1)
      }
  }

  const clearLetterStates = () => {
    setGuessedLatters([])
    setWrongLetters([])
  }

  // monitora um dado com useEffect
  useEffect(() => {

    if(guesses <= 0){

      // resetar todos os estados antes do gameover
      clearLetterStates()

      setGameStage(stages[2].name)

    }

  }, [guesses])

  // reinicia o jogo  
  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
  
    setGameStage(stages[0].name)
  }
  


  return (
    <div className="App">
      {/*Só vai aparecer a StartScreen se gameStage for 'start'*/}
      {gameStage === 'start' && <StartScreen startGame={startGame}/>}
      {/*Só vai aparecer a Game se gameStage for 'start'*/}
      {/*O componente recebe os valores das funções para iniciar o jogo */}
      {gameStage === 'game' && (
        <Game 
          verifyLetter={verifyLetter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {/*Só vai aparecer a GameOver se gameStage for 'start'*/}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}

    </div>
  )
}

export default App
