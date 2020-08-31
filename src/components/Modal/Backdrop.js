import React from 'react'
import classes from './Backdrop.module.css';
const Backdrop = (props) => {
    const {setOpened}=props;
    const closeModal =()=>{
        setOpened(false)
    }
    return (
        <div onClick={()=>closeModal()} className={classes.Backdrop}>
        </div>
    )
};
export default Backdrop;
