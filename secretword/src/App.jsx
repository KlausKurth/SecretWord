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
  const [guessedLetters, setGuessedLetters] = useState([])
  //controla as letras erradas
  const [wrongLetters, setWrongLetters] = useState([])
  //controla a quantidades de tentativas que o jogador vai ter
  const [guesses, setGuesses] = useState(guessesQty)
  //contrla a pontuação do jogador
  const [score, setScore] = useState(0)


  // Pegar uma categoria e palavra aleatória
  //O useCallback é um hook do React que memoriza uma função, ou seja: Essa função só será recriada se alguma dependência no array [] mudar (nesse caso, nunca muda).
  //E por que pickWordAndCategory também tem useCallback? Porque ele está sendo usado dentro de startGame, que também está dentro de um useEffect.
  const pickWordAndCategory = useCallback(() => {
    
    // pega o array de categorias do arquivo words.js
    const categories = Object.keys(words)
    // Math.random() gera um número aleatório entre 0 e 1
    // Multiplicamos esse número pelo tamanho do array de categorias com .length
    // Math.floor(...) arredonda o valor para baixo, transformando em um índice válido para acessar o array.
    // Exemplo : 
    // Math.random() * 6 // Suponha que dá 4.87
    // Math.floor(4.87)  // Vira 4
    // categories[4]     // Acessa a quinta categoria
    const category = categories[Math.floor(Math.random() * categories.length)];

    //Debugger
    //console.log(category)
    
    //pegar uma palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)];

    //Debugger
    //console.log(word)

    // Retornando o valor como objeto
    //
    return {word, category}
  }, [words])

  // Função que inicia o jogo
  // stage 1 segundo estágio game
  //O useCallback é um hook do React que memoriza uma função, ou seja: Essa função só será recriada se alguma dependência no array [] mudar (nesse caso, nunca muda).
  // Se startGame não estivesse envolvida com useCallback, o React iria pensar que startGame muda a cada renderização, mesmo sem necessidade. 
  // Isso faria o useEffect executar mais vezes do que deveria, ou mesmo emitir warnings de dependências instáveis.
  const startGame = useCallback(() => {
    // ao inicio do jogo reiniciar os estados
    clearLetterStates()

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


  }, [pickWordAndCategory])

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
        setGuessedLetters((actualGuessedLetters) => [
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
    setGuessedLetters([])
    setWrongLetters([])
  }

  //o useEffect é um hook do React. Ele é uma função fornecida pelo React (a partir da versão 16.8) que permite você executar efeitos colaterais em componentes funcionais.
  // monitora um dado com useEffect
  //Esse useEffect é o monitor do número de tentativas. Ele serve para:
  //Esse array no final ([guesses]) indica que o useEffect só será executado quando o valor de guesses mudar.
  //O useEffect não é uma condicional — ele sempre é executado quando as dependências mudam.
  useEffect(() => {

    if(guesses <= 0){

      // resetar todos os estados antes do gameover
      clearLetterStates()

      setGameStage(stages[2].name)

    }

  }, [guesses])

  // Verifica se ganhou
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
  
    if (
      gameStage === "game" && // <-- impede execução no início
      guessedLetters.length > 0 && 
      guessedLetters.length === uniqueLetters.length
    ) {
      setScore((actualScore) => actualScore + 100);
      startGame();
    }
  }, [guessedLetters, letters, startGame, gameStage]);


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
