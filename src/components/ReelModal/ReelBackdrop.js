import React from 'react';
import classes from './ReelBackdrop.module.css';
const ReelBackdrop = (props) => {
    return (
        <div >
            {props.show ? <div onClick={props.clicked} className={classes.ReelBackdrop} style={{ backgroundColor: props.Bcolor }}></div> : null}
        </div>
    )
};
export default ReelBackdrop;
