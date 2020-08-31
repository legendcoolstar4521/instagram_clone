import React, { useEffect, useState } from 'react'
import classes from './FollowUser.module.css';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../../firebase';
import axios from 'axios';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import {Link} from 'react-router-dom';
function FollowUser(props) {
    const { id, follow, uid, type ,setOpenDropdown,setShowSearch} = props;
    const [followname, setFollowName] = useState('');
    const [isFollowing, SetFollowing] = useState(follow);
    useEffect(() => {
        let unsubscribe = null;
        unsubscribe = (
            db.ref().child(`users/${id}/username`).on("value", Snapshot => {
                let data = Snapshot ? Snapshot.val() : null;
                if (!data || data === 'not set') {
                    return;
                }
                setFollowName(data)
            })
        )
        return () => {
            db.ref().child(`users/${id}/username`).off();
            unsubscribe();
        }
    }, [id])
    const followSelectedUser = () => {
        if (!follow) {
            axios.put('https://instagram-clone-ff041.firebaseio.com/users/' + id + '/followers/' + uid + '.json', true).then(res => {
                SetFollowing(true)
                axios.put('https://instagram-clone-ff041.firebaseio.com/users/' + id + '/notifications/' + uid + '.json', true)
            })
            axios.put('https://instagram-clone-ff041.firebaseio.com/users/' + uid + '/following/' + id + '.json', true)
        }
        else {
            db.ref(`users/${uid}/following/${id}`).remove();
            db.ref(`users/${id}/followers/${uid}`).remove();
            SetFollowing(false)
        }

    }
    const close=()=>{
        if(setOpenDropdown){
            setOpenDropdown(false)
        }
        if(setShowSearch){
            setShowSearch(false)
        }
    }
    return (
        <Aux>
            <div className={classes.FollowUser}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <Avatar
                        style={{ width: '30px', height: '30px' }}
                        className="post_avatar"
                        alt="IconDev"
                        src="/static/images/avatar/1.jpg" />
                   <Link onClick={()=>close()} style={{fontSize:'15px',fontWeight:'600',textDecoration:'none',color:'#484848'}} to={"/p/"+ id +"/" + followname+ "/posts"} >{followname}</Link>
                    {type === 'notification' ? <p style={{ fontSize: '13px', marginLeft: '3px' }}> started following you</p> : null}
                </div>
                {id !== uid ?
                    <button className={classes.edit_profile_button} style={{backgroundColor:isFollowing?'#fafafa':'#1dafff',color:isFollowing?'black':'white'}} onClick={() => followSelectedUser()}>{isFollowing ? "following" : "follow"}</button> : null}

            </div>
        </Aux>
    )
}

export default FollowUser
