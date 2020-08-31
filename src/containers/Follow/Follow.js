import React, { useEffect, useState } from 'react'
import { db } from '../../firebase';
import { Avatar } from '@material-ui/core';
import './Follow.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
function Follow(props) {
    const { uid, username } = props;
    const [users, setUsers] = useState([]);
    const [following, setFollowing] = useState(null);
    useEffect(() => {
        let unsubscribe = null;
        unsubscribe = (
            db.ref().child(`users/${uid}/following`).on("value", Snapshot => {
                let data = Snapshot ? Snapshot.val() : null;
                if (!data || data === 'not set') {
                    setFollowing([]);
                    return;
                }
                let values = Object.keys(data)
                setFollowing(values)
            })
        )
        return () => {
            db.ref().child(`users/${uid}/following`).off()
            unsubscribe();
        }
    }, [uid])
    useEffect(() => {
        let unsubscribe = null;
        unsubscribe = (db.ref().child(`users`).on("value", Snapshot => {
            let data = Snapshot ? Snapshot.val() : null;
            if (!data || data === 'not set') {
                return
            }
            if (following) {
                for (let key in following) {
                    let followedKey = following[key].toString();
                    delete data[followedKey]
                }
            }
            let values = Object.entries(data);
            const userData = [];
            values.map(value => (
                userData.push({
                    id: value[0],
                    data: value[1]
                })
            ))
            const filteredData = userData.filter(userD => {
                return userD.id !== uid
            })
            if (following) {
                setUsers(filteredData);
            }
        }))
        return () => {
            db.ref().child(`users`).off()
            unsubscribe();
        }
    }, [uid, following])
    const follow = (id) => {
        if (uid) {
            axios.put('https://instagram-clone-ff041.firebaseio.com/users/' + id + '/followers/' + uid + '.json', true).then(res => {
                axios.put('https://instagram-clone-ff041.firebaseio.com/users/' + id + '/notifications/' + uid + '.json', true)
            })
            axios.put('https://instagram-clone-ff041.firebaseio.com/users/' + uid + '/following/' + id + '.json', true)
        }
        else {
            alert("please login")
        }
    }
    return (
        <div className="explore">
            <div className="explore_user">
                <Avatar
                    className="post_avatar"
                    alt="IconDev"
                    src="/static/images/avatar/1.jpg" />
                <p>{username}</p>
            </div>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#8e8e8e', marginTop: '20px' }}>Suggestions For You</p>
            {users ? users.map(user => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: '10px' }} key={user.id}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Avatar
                            style={{ width: '30px', height: '30px' }}
                            className="post_avatar"
                            alt="IconDev"
                            src="/static/images/avatar/1.jpg" />
                        <Link style={{ fontSize: '15px', fontWeight: '600', textDecoration: 'none', color: '#484848' }} to={"/p/" + user.id + "/" + user.data.username} >{user.data.username}</Link>
                    </div>
                    <button className="button" onClick={() => follow(user.id)}>Follow</button></div>
            )) : null}
            <div style={{ display: 'flex', marginTop: '20px', fontSize: '14px' }} >
                <FontAwesomeIcon color="#c7c7c7" icon={faCopyright} />
                <p style={{ fontSize: '12px', color: '#c7c7c7', marginLeft: '5px' }}>2020 Instagram-clone FROM DEV BANSAL</p>
            </div>
        </div>
    )
}
export default Follow;
