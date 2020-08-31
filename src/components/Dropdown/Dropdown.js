import React from 'react'
import classes from './Dropdown.module.css';
import { auth } from '../../firebase';
import Button from '@material-ui/core/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faBookmark, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import {withRouter} from 'react-router-dom';
import Notifications from '../Notifications/Notifications';
function Dropdown(props) {
    const { setLoggedIn, setOpenSignIn, loggedIn, type, uid,setOpenDropdown,username } = props;

    const signOut = () => {
        localStorage.removeItem('isLoggedIn');
        setLoggedIn(false);
        props.history.push('/');
        setOpenSignIn(true);
        auth.signOut();
    }
    const goThere =(location)=>{
        setOpenDropdown(false);
        setOpenSignIn(false);
        props.history.push('/'+location);
    }

    return (
        <div className={classes.Dropdown}>
            {type==='notification'?
            <Notifications uid={uid} setOpenDropdown={setOpenDropdown}/>:null}
            {type==='user' ? loggedIn || uid ?
                <div className={classes.UserSet}>
                    <div className={classes.NavigationHolder}>
                        <div className={classes.Navigator} onClick={()=>goThere("p/"+uid+"/"+username+"/posts")}>
                            <FontAwesomeIcon className={classes.icon} icon={faUserCircle} />
                            <p>Profile</p>
                        </div>
                        <div className={classes.Navigator} onClick={()=>goThere("p/"+uid+"/"+username+"/saved")}>
                            <FontAwesomeIcon className={classes.icon} icon={faBookmark} />
                            <p>Saved</p>
                        </div>
                        <div className={classes.Navigator}>
                            <FontAwesomeIcon className={classes.icon} icon={faCog} />
                            <p>Settings</p>
                        </div>
                    </div>
                    <Button onClick={() => signOut()}>Logout</Button>
                </div>
                :
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h4>empty</h4>
                </div>
                :
                null
            }
        </div>
    )
}
export default withRouter(Dropdown);
