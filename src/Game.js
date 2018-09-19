import React, {Component} from 'react';
import Board from './Board';

function calculateWinner(squares){
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for(let i=0 ;i<lines.length; i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return {
                line: [a, b, c],
                winner: squares[a]
            };
        }
    }
    return null;
}

function getCoord(i){
    const coords = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2]
    ];
    return '(' + coords[i][0] + ', ' + coords[i][1] + ')';
}

class Game extends Component{
    constructor(props){
        super(props);
        this.state = {
            history: [
                {squares: Array(9).fill(null)}
            ],
            winningSquares: null,
            steps: [],
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick = (i) => {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if(this.state.winningSquares || squares[i]){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState(preState => ({
            history: history.concat([{
                squares: squares
            }]),
            steps: [...preState.steps, i],
            stepNumber: history.length,
            xIsNext: !preState.xIsNext
        }));
        if(calculateWinner(squares)){
            this.setState({
                winningSquares: calculateWinner(squares).line
            });
        }
    }

    jumpTo = (step) => {
        const history = this.state.history.slice(0, step+1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        this.setState({
            winningSquares: null,
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
        if(calculateWinner(squares)){
            this.setState({
                winningSquares: calculateWinner(squares).line
            });
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const squares = current.squares;
        const winner = calculateWinner(squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const loc = move ? getCoord(this.state.steps[move-1]) : '';
            return (
                <li key={move}>
                    <button className={this.state.stepNumber === move ? 'chosen': ''} 
                            onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                    {' '}
                    {loc}
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner.winner;
        } else if(!squares.includes(null)){
            status = 'Tied!!!';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={squares} 
                        onClick={(i) => this.handleClick(i)}
                        winningSquares={this.state.winningSquares}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

export default Game;