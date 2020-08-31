import React from 'react'
import classes from './Backdrop.module.css';
const Backdrop = (props) => {
    return (
        <div >
            {props.show ? <div onClick={props.clicked} className={classes.Backdrop} style={{ backgroundColor: props.Bcolor }}></div> : null}
        </div>
    )
};
export default Backdrop;
