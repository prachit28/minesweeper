import React from 'react';
import { CgFlagAlt } from 'react-icons/cg';
import { GiLandMine } from 'react-icons/gi';
import PropTypes from 'prop-types';

export class Square extends React.Component {

    getSquareState = () => {
        const { squareState } = this.props;

        if(!squareState.isOpened) {
            return this.props.squareState.isFlagged ? <CgFlagAlt/> : null
        }

        if(squareState.isMine) {
            return <GiLandMine />
        }

        if(squareState.adjacent === 0) {
            return null
        }

        return squareState.adjacent;
    }

    render() {
        const { squareState, onSquareClick, onFlagClick } = this.props;
        let classNames = [
            "sqaure",
            !squareState.isOpened ? 'unopened' : '',
            squareState.isMine ? 'mine' : '',
            squareState.isFlagged ? 'flagged' : '',
        ];
        return (
            <div 
                className={classNames.join(' ')}
                onClick={onSquareClick}
                onContextMenu={onFlagClick}
            >
                { this.getSquareState() }
            </div>
        )
    }
}

Square.propTypes = {
    squareState: PropTypes.shape({
        isOpened: PropTypes.bool,
        isMine: PropTypes.bool,
        isFlagged: PropTypes.bool,
    }).isRequired,
    onSquareClick: PropTypes.func.isRequired,
    onFlagClick: PropTypes.func.isRequired
}

export default Square
