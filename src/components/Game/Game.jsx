import React from 'react';
import Minefield from '../Minefield/Minefield';

export class Game extends React.Component {

    state = {
        rows: 8,
        columns: 8,
        mines: 10,
        startGame: false
    }

    gameStart = () => this.setState({ startGame: true })

    reset = () => this.setState({startGame: false})

    onChangeHandler = e => {
        
        switch (e.target.name) {
            case 'size':
                this.setState({ rows: parseInt(e.target.value), columns: parseInt(e.target.value)  });
                break;
            case 'mines':
                this.setState({ mines: parseInt(e.target.value) });
                break;
            default:
                break;
        }
    }
    render() {
        const { rows, columns, mines, startGame } = this.state;
        let html;
        if(startGame) {
            html = <Minefield rows={rows} columns={columns} mines={mines} reset={this.reset}/>;
        } else {
            html = (
            <form className="titleScreen">
                <h3>Minesweeper</h3>
                <label htmlFor="rows">
                    Size: <input type="number" name="size" value={this.state.rows} onChange={this.onChangeHandler} />
                </label>    
                <label>
                    Mines: <input type="number" name="mines" value={this.state.mines} onChange={this.onChangeHandler} />
                </label>
                <button onClick={this.gameStart}>Start</button>
            </form>
            )
        }
        return (
            <div className="game">
                { html }
            </div>
        )
    }
}

export default Game
