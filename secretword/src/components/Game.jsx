//utiliza useRef para voltar o input da caixa de texto da letra
import { useState , useRef} from "react"
import "./Game.css"

// o componente recebe do props todas as variaveis para poder iniciar o jogo com os valores de inicio
const Game = ({
    verifyLetter,
    pickedWord,
    pickedCategory,
    letters,
    guessedLetters,
    wrongLetters,
    guesses,
    score
 }) => {
    const [letter, setLetter] = useState("")
    //Para criar uma referência em algum lugar 
    const letterInputRef = useRef(null)

    const handleSubmit = (e) => {
        e.preventDefault();

        // envia a letra inputada no text box
        verifyLetter(letter)

        // limpa o text box
        setLetter("")

        //vou focar no elemente apos o submmit, assim ele volta automaticamente para box text
        letterInputRef.current.focus()
    }

  return (
    <div className="game">
        <p className="points">
            <span>Pontuação: {score}</span>
        </p>
        <h1>Adivinhe a palavra</h1>
        <h3 className="tip">
            Dica sobre a palavra: <span>{pickedCategory}</span>
        </h3>
        <p>Você ainda tem {guesses} tentativas</p>
        <div className="wordContainer">

            {letters.map((letter, i) =>(
                //se a letra tiver sido adivinhada
                guessedLetters.includes(letter) ? (
                    <span key={i} className="letter">
                        {letter}
                    </span>
                ) : (
                    <span key={i} className="blankSquare"></span>
                )
                       
            ))}            
        </div>
        <div className="letterContainer">
            <p>Tente adivinhar uma letra da palavra</p>
            <form onSubmit={handleSubmit}>
                {/*Atribuir a variavel useState letter em onChange do input que é a letra que o jogador escolhe*/}
                <input 
                    type="text" 
                    name="letter" 
                    maxLength="l" 
                    required 
                    onChange={(e) => setLetter(e.target.value)}
                    value={letter}
                    //Seto a referencia de letter com userRef
                    ref={letterInputRef}
                />
                <button>Jogar!</button>
            </form>
        </div>
        <div className="wrongLettersContainer">
            <p>Letras já utilizadas:</p>
            {wrongLetters.map((letter, i) => (
                <span key={i}>{letter},</span>           
            ))}
        </div>
        {/*<button onClick={verifyLetter}>Finalizar o jogo</button>*/}
    </div>
  )
}

export default Game