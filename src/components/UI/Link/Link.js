import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './Link.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const LinkComponent = (props) => {
    const { clicked, link, exact, icon } = props;
    return (
        <div className={classes.Container} onClick={clicked}>
            <div className={classes.Content}>
                <NavLink className={classes.Link} activeClassName={classes.ContainerActive}
                    to={link} exact={exact} >
                    <div className={classes.Icon}>
                        <FontAwesomeIcon icon={icon} />
                    </div>
                    <div className={classes.text}>
                        {props.children}
                    </div>
                </NavLink>
            </div>
        </div>
    )
};
export default LinkComponent;