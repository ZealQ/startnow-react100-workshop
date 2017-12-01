
// imports that allow react to work
import React from 'react';
import ReactDOM from 'react-dom';

// the squeare frame as well as the boxes inside  that players  press to add an "X" or an "O"
function Square(props) {
  return (
    // part of the code to highlight the winner
    <button className={props.highlight[props.index]} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// the game Board and its compontnts
class Board extends React.Component {
  // this  will render the board as a whole with all the squares inside
  renderSquare(i, obj) {
    return (
      // this is the componet Square with all of is props (peramiters)
      <Square
      // key is a special prop that can only be used once
        key={i}
        // index is the prop that will allow the highlight to work
        index={i}
        // equivlent  is that creats the obj that makes the loops for making the squares
        equivalent={obj}
        // value renders the squares and  there index(plyer input)
        value={this.props.squares[i]}
        // onclick it will allow the user to input
        onClick={() => this.props.onClick(i, obj)}
        // highligt will highlight the winning squares
        highlight={this.props.highlight}
      />
    );
  }
  // render will render the game board each time that there is  a change
  render() {
    // counter will allow the game board to create a new cell each time it is needed
    let counter = 0, equivalent = {};
    return (
      // the obj 1,2,3 will map out in the game board and make the array be (1,0) insted of # 1
      // the two loops that are needed to create the game rows and col with out haveing to hard coat them
      <div>
        {[1, 2, 3].map((row) => {
          return (
            <div key={row} className="board-row">
              {[1, 2, 3].map((col) => {
                return this.renderSquare(counter++, [col, row]);
              })}
            </div>
          )
        }
        )}
      </div>
    );
  }
}
// the game this is the inter acrtion pahse of the code where the players play
class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      // this  is a prop that will help with logging the game history
      history: [{
        squares: Array(9).fill(null),
      }],
      // stepNumber is the log of when the player inputed
      stepNumber: 0,
      // xIsNext is the way that the game  knows whos turn it is
      xIsNext: true,
      // toggle is the way that the game will know whos move its on  
      toggle: true,
    };
  }

  // the handelClick is and event handeler used to let the game board know  when something has bin changed in the game 
  handleClick(i, obj) {
    // this  will allows view of  the history of the turns that  were taken
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // current allows view of  the current turn a player made in the logs
    const current = history[history.length - 1];
    // squares allow  view of the currently clicked 
    const squares = current.squares.slice();
    // this if will then point out the  winnere
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // next players
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{
        move: obj,
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

// jumpTo
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

// will help changes the order of the history logs 
  toggle() {
    this.setState({
      toggle: !this.state.toggle
    })
  }
// renders the history the current movies and the winner
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

// object that will high light all the squares in the array
    let highlight = {
      0: "square",
      1: "square",
      2: "square",
      3: "square",
      4: "square",
      5: "square",
      6: "square",
      7: "square",
      8: "square",
    }

    let status;
    if (winner) {
      status = "Winner: " + winner.shift();
 
      // highlights the winning squars  with out highliteing the others
      highlight[winner[0]] = "square highlight";
      highlight[winner[1]] = "square highlight";
      highlight[winner[2]] = "square highlight";
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

// the moves that where made then logged buy location
    const moves = history.map((step, move) => {
      const desc = move ?
        "move (" + step.move + ")" :
        "Game start";
      return (
        <li key={move}>
      {/* code that allows you to bold the current log that is clicked or move player is on */}
          <a href="#" onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc} </a>
        </li>
      );
    });
// gose threw the whole array
    let tMove = [...moves];
    // will allow the log aray to be shifted 
    let hold = tMove.shift();
    // will keep "start game in one place as the rest of the logs move"
    tMove.reverse().unshift(hold);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i, obj) => this.handleClick(i, obj)}
            highlight={highlight}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          {/* button that will allow the log list to change from Ascending to Decending and vice versa */}
          <button onClick={() => this.toggle()}> {this.state.toggle === true ? "Ascending" : "Decending"}</button>
          {this.state.toggle === true ?
            <ol>{moves}</ol> : <ol>{tMove}</ol>}
        </div>
      </div>
    );
  }
}
// loops threw the array and  gives you a winner
function calculateWinner(squares) {
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
      return [squares[a], a, b, c];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

