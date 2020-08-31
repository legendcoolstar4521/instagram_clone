import React from 'react';
import classes from './Modal.module.css';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Backdrop from './Backdrop';
const Modal = (props) => {
    const {open,setOpened,openBack} = props;
    return (
        <Aux>
            {open ? <div className={classes.Container}>
                {openBack?<Backdrop setOpened={setOpened}  />:null}
                <div className={classes.Modal}>
                    {props.children}
                </div>
            </div> : null}
        </Aux>
    )
};
export default Modal;
