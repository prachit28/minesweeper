import React from 'react'
import PropTypes from 'prop-types';
import Square from '../Square/Square'

const WIN = 'You Win!';
const LOSE = 'Game Over!'

export class Minefield extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            minefieldData: this.createMinefield(this.props.rows, this.props.columns, this.props.mines),
            gameStatus: '',
            mineCount: this.props.mines,
        }
    }

    restartGame = () => {
        this.setState({
            minefieldData: this.createMinefield(this.props.rows, this.props.columns, this.props.mines),
            gameStatus: '',
            mineCount: this.props.mines,
        });
    }

    getFieldObject = (object, data) => {
        let newData = [], objectProperty;
        switch(object) {
            case 'mines': 
                objectProperty = 'isMine';
                break;
            case 'flags':
                objectProperty = 'isFlagged';
                break;
            case 'hidden':
                objectProperty = 'isOpened';
                break;
            default:
                return
        }
        data.forEach(row => {
            row.forEach(sqaure => {
                if(object === 'hidden'){
                    if(!sqaure[objectProperty]){
                        newData.push(sqaure);
                    } 
                } else {
                    if(sqaure[objectProperty]){
                        newData.push(sqaure);
                    }
                }
            });
        });
    
        return newData;
    }

    getRandomNumber = value => Math.floor(Math.random() * value) ;

    createMinefield = (rows, columns, mines) => {
        let data = this.createEmptyField(rows, columns);
        data = this.generateMines(data, rows, columns, mines);
        data = this.getAdjacent(data, rows, columns);
        return data;
    }

    createEmptyField = (rows, columns) => {
        let data = [];

        for(let i = 0; i < columns; i++) {
            data.push([]);
            for(let j = 0; j < rows; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    adjacent: 0,
                    isOpened: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        return data;
    }

    generateMines = (data, rows, columns, mines) => {
        let randomX, randomY, minesGenerated = 0;
        while(minesGenerated < mines) {
            randomX = this.getRandomNumber(rows);
            randomY = this.getRandomNumber(columns);
            if(!(data[randomX][randomY].isMine)) {
                data[randomX][randomY].isMine = true;
                minesGenerated++;
            }
        }
        return data;
    }

    getAdjacent = (data, rows, columns) => {
        let newData = data;
        for(let i = 0; i < columns; i++) {
            for(let j = 0; j < rows; j++) {
                if(!data[i][j].isMine) {
                    let mine = 0;
                    const land = this.checkMinefield(data[i][j].x, data[i][j].y, data);
                    land.forEach(sqaure => {
                        if (sqaure.isMine) {
                            mine++;
                        }
                    });
                    if(mine === 0) {
                        newData[i][j].isEmpty = true;
                    }
                    newData[i][j].adjacent = mine;
                }
            }
        }
        return newData;
    }

    checkMinefield = (x, y, data) => {
        const adjacent = [];

        //up
        if (x > 0) {
            adjacent.push(data[x - 1][y]);
        }

        //down
        if (x < this.props.columns - 1) {
            adjacent.push(data[x + 1][y]);
        }

        //left
        if (y > 0) {
            adjacent.push(data[x][y - 1]);
        }

        //right
        if (y < this.props.rows - 1) {
            adjacent.push(data[x][y + 1]);
        }

        // top left
        if (x > 0 && y > 0) {
            adjacent.push(data[x - 1][y - 1]);
        }

        // top right
        if (x > 0 && y < this.props.rows - 1) {
            adjacent.push(data[x - 1][y + 1]);
        }

        // bottom right
        if (x < this.props.columns - 1 && y < this.props.rows - 1) {
            adjacent.push(data[x + 1][y + 1]);
        }

        // bottom left
        if (x < this.props.columns - 1 && y > 0) {
            adjacent.push(data[x + 1][y - 1]);
        }

        return adjacent;
    }

    revealMinefield = () => {
        let newMinefieldData = this.state.minefieldData;
        newMinefieldData.forEach(row => {
            row.forEach(square => {
                square.isOpened = true;
            });
        });

        this.setState({ minefieldData: newMinefieldData });
    }

    revealEmpty = (x, y, data) => {
        let land = this.checkMinefield(x, y, data);
        land.forEach(square => {
            if(!square.isFlagged && !square.isOpened && (square.isEmpty || !square.isMine)) {
                data[square.x][square.y].isOpened = true;
                if(square.isEmpty){
                    this.revealEmpty(square.x, square.y, data);
                }
            }
        });
        return data;
    }

    handleSquareClick = square => {
        const { x, y } = square;
        const { minefieldData } = this.state;

        if(minefieldData[x][y].isOpened || minefieldData[x][y].isFlagged) return null;

        if(minefieldData[x][y].isMine) {
            this.setState({ gameStatus: LOSE });
            this.revealMinefield();
        }

        let newMinefieldData = minefieldData;
        newMinefieldData[x][y].isFlagged = false;
        newMinefieldData[x][y].isOpened = true;
        
        if(newMinefieldData[x][y].isEmpty) {
            newMinefieldData = this.revealEmpty(x, y, newMinefieldData);
        }

        if(this.getFieldObject('hidden', newMinefieldData).length === this.props.mines) {
            this.setState({ mineCount: 0, gameStatus: WIN});
            this.revealMinefield();
        }

        this.setState({
            minefieldData: newMinefieldData,
            mineCount: this.props.mines - this.getFieldObject('flags', newMinefieldData).length,
        })
    }

    handleFlagClick = (e, square) => {
        e.preventDefault();
        const {x, y} = square;

        let newMinefieldData = this.state.minefieldData;
        let mines = this.state.mineCount;

        if(newMinefieldData[x][y].isOpened) return;

        if(newMinefieldData[x][y].isFlagged) {
            newMinefieldData[x][y].isFlagged = false;
            mines++;
        } else {
            newMinefieldData[x][y].isFlagged = true;
            mines--;
        }

        if(mines === 0) {
            const minePlaced = this.getFieldObject('mines',newMinefieldData);
            const flagPlaced = this.getFieldObject('flags',newMinefieldData);

            if(JSON.stringify(minePlaced) === JSON.stringify(flagPlaced)) {
                this.setState({ mineCount: 0, gameStatus: WIN});
                this.revealMinefield();
            }
        }

        this.setState({
            minefieldData: newMinefieldData,
            mineCount: mines,
        });
    }

    renderMinefield = data => {
        return data.map(row => {
            return row.map(square => {
                return (
                    <div key={square.x * row.length + square.y} >
                        <Square
                            onSquareClick={() => this.handleSquareClick(square)}
                            onFlagClick={(e) => this.handleFlagClick(e, square )}
                            squareState={square}
                        />
                        {(row[row.length - 1] === square) ? <div className="clear" /> : ""}
                    </div>
                );
            })
        });
    } 

    render() {
        return (
            <div className="minefield">
                <div className="hud">
                    <h2>{this.state.gameStatus}</h2>
                    <span className="minesStatus">Mines left: {this.state.mineCount}</span>
                    { 
                        this.state.gameStatus !== '' && 
                        <>
                            <button onClick={this.restartGame} > Restart </button> 
                            <button onClick={this.props.reset} > Reset </button> 
                        </>
                    }
                </div>
                <div className="play-area">
                {
                    this.state.minefieldData && this.renderMinefield(this.state.minefieldData)
                }
                </div>
            </div>
        )
    }
}

Minefield.propTypes = {
    rows: PropTypes.number.isRequired,
    columns: PropTypes.number.isRequired,
    mines: PropTypes.number.isRequired,
    reset: PropTypes.func.isRequired,
}

export default Minefield
