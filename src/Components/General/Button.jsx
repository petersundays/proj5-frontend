import React from 'react';
import './Button.css';

function Button(props) {
    return (
        <button
            id={props.id}
            type={props.type}
            className={props.className}
            onClick={props.onClick} 
            style={{ width: props.width , display: props.hidden ? 'none' : 'block', marginLeft: props.marginLeft, marginRight: props.marginRight}}
            
        >
            {props.text}
        </button>
    );
}

Button.defaultProps = {
    id: 'button',
    type: 'button',
    className: 'button',
    onClick: () => {},
    width: '120px',
    text: 'Button'
};

export default Button;
