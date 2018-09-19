import React from 'react';

function Square(props){
    return (
        <button 
        className="square" 
        onClick={props.onClick} 
        style={props.winningSquare ? {background: 'yellow'} : {}}>
            {props.value}
        </button>
    );
}

export default Square;