import React, { useState, useEffect } from 'react';
import classes from './Follow.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../firebase';
import FollowUser from '../FollowUser/FollowUser';
function Follow(props) {
    const { uid, follow, followType } = props;
    const [followList, setFollowList] = useState(null);
    const [followNo, setFollowNo] = useState(0);
    useEffect(() => {
        let unsubscribe = null;
        unsubscribe = (
            (
                db.ref().child(`users/${uid}/following`).on("value", Snapshot => {
                    let data = Snapshot ? Snapshot.val() : null;
                    if (!data || data === 'not set') {
                        return;
                    }
                    let values = Object.keys(data);
                    let notFollowed = [];
                    let Followed = [];
                    if (follow) {
                        notFollowed = follow.filter(function (obj) { return values.indexOf(obj) === -1; });
                        Followed = follow.filter(function (obj) { return values.indexOf(obj) !== -1; });
                        setFollowNo(follow.length)
                    }
                    let extra = [];
                    notFollowed.map(notF => (
                        extra.push({
                            id: notF,
                            followed: false
                        })
                    ))
                    Followed.map(value => (
                        extra.push({
                            id: value,
                            followed: true
                        })
                    ))
                    setFollowList(extra)
                })
            )
        )
        return () => {
            db.ref().child(`users/${uid}/following`).off();
            unsubscribe();
        }
    }, [uid, follow, followType])
    return (
        <div className={classes.Follow}>
            {/**heading */}
            <p style={{ borderBottom: '1px solid #ccc', height: '35px', textAlign: 'center', marginTop: '10px', fontSize: '13px' }}><strong>{followType}</strong></p>
            {/**total likes */}
            <div className={classes.Text}><FontAwesomeIcon icon={faUser} /><p></p>&nbsp;{followNo}</div>
            <p style={{ textAlign: 'center', color: '#c7c7c7', fontSize: '14px' }}>You can restrice people who see your {followType} list</p>
            {/** scrollable following user list */}
            <div className={classes.scrollLikedList}>
                {followList ? followList.map(liked => (
                    <FollowUser key={liked.id} id={liked.id} follow={liked.followed} uid={uid} />
                )) : null}
            </div>
        </div>
    )
}


export default Follow
