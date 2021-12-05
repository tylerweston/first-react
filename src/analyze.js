import { calculateWinner } from './index.js';

export function analyze(squares) {
    // board in squares, a 3x3 board stored in a 9-element array
    // based on a given position, return the number of wins and draws
    // possible for the players
    let results = {x_wins: 0, o_wins: 0, draws: 0};
   
    // first, we can figure out whose turn it is by counting the number of X's and O's
    let xCount = squares.filter(square => square === 'X').length;
    let oCount = squares.filter(square => square === 'O').length;

    // lets check for a win or draw first
    if (check_win_draw(squares, results, xCount, oCount)) {
        return normalize(results);
    }

    // otherwise, expand tree and collect children
    let xIsNext = xCount <= oCount;
    let squares_tree = {squares: squares, children: []};
    expand_tree(squares_tree, xIsNext);
    count_results(squares_tree, results);
    return normalize(results); 
}

function check_win_draw(squares, results, xCount, oCount) {
    let winner = calculateWinner(squares);
    if (winner === 'X') {
        results['x_wins'] += 1;
        return true;
    } else if (winner === 'O') {
        results['o_wins'] += 1;
        return true;
    }
    if (xCount + oCount === 9) {
        results['draws'] += 1;
        return true;
    }
    return false;;
}

function expand_tree(node, xIsNext) {
    // given a node, expand it to all possible children
    // if xIsNext is true, then the next player is X
    // if xIsNext is false, then the next player is O
    let children = [];
    let squares = node.squares;
    // get a list of all open squares
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            let new_squares = squares.slice();
            new_squares[i] = xIsNext ? 'X' : 'O';
            children.push({squares: new_squares, children: []});
        }
    }
    for (let i = 0; i < children.length; i++) {
        expand_tree(children[i], !xIsNext);
    }
    node.children = children;
}

function count_results(node, results) {
    // given a node, count the number of wins and draws
    // if the node is a leaf node, then we have a winner
    // if the node is not a leaf node, then we have a draw
    if (node.children.length === 0) {
        let winner = calculateWinner(node.squares);
        if (winner === 'X') {
            results['x_wins'] += 1;
        } else if (winner === 'O') {
            results['o_wins'] += 1;
        } else {
            results['draws'] += 1;
        }
    }
    for (let i = 0; i < node.children.length; i++) {
        count_results(node.children[i], results);
    }
}

function normalize(results) {
    let total = results['x_wins'] + results['o_wins'] + results['draws'];
    let x_wins = results['x_wins'] / total;
    let o_wins = results['o_wins'] / total;
    let draws = results['draws'] / total;
    return {x_wins, o_wins, draws};
}
