import { analyze } from './analyze';
import React from 'react';
import ReactDOM from 'react-dom';
import { PieChart } from 'react-minimal-pie-chart';
import './index.css';
/*
Rewrite Board to use two loops to make the squares instead of hardcoding them.
Add a toggle button that lets you sort the moves in either ascending or descending order.
When someone wins, highlight the three squares that caused the win.
Increase board size to arbitrary size.
Allow option to change number of items in a row for a win.
Toggle computer play.
*/
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        history: [{
            played_move: null,
            squares: Array(9).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
        return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
        history: history.concat([{
            played_move: i,
            squares: squares
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {

            const desc = move ?
            'Go to move #' + move + ' - ' + indexToCoord(step.played_move) :
            'Go to game start';
            return (
                // if (move === this.state.stepNumber) {
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        <span style={{"fontWeight":(move === this.state.stepNumber?"bold":"normal")}}>{desc}</span>
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.state.stepNumber === 9) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let analysis_results = analyze(current.squares, this.state.xIsNext);
        //console.log(analysis_results);

        return (
        <div className="game">
            <div className="game-board">
            <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
            </div>
            <div>
            <PieChart
                data={[
                    { title: 'X', value: analysis_results['x_wins'], color: '#E38627' },
                    { title: 'O', value: analysis_results['o_wins'], color: '#C13C37' },
                    { title: 'Draw', value: analysis_results['draws'], color: '#6A2135' },
                ]}
            />
            </div>
        </div>
        );
    }
}

function indexToCoord(index) {
    return `(${index % 3}, ${Math.floor(index / 3)})`;
}
  
// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

export function calculateWinner(squares) {
    const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
    }
    }
    return null;
}
  
