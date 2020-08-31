import React from 'react'
import classes from './OverBackdrop.module.css';
const OverBackdrop = (props) => {
    return (
        <div >
            {props.show ? <div onClick={props.clicked} className={classes.Backdrop} style={{ backgroundColor: props.Bcolor }}></div> : null}
        </div>
    )
};
export default OverBackdrop;
