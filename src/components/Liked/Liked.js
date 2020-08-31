import React, { useState, useEffect } from 'react';
import classes from './Liked.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../firebase';
import FollowUser from '../FollowUser/FollowUser';
function Liked(props) {
    const { heartNo, uid, hearts } = props;
    const [likedList, setLikedList] = useState([]);
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
                    let notFollowed = hearts.filter(function (obj) { return values.indexOf(obj) === -1; });
                    let Followed = hearts.filter(function (obj) { return values.indexOf(obj) !== -1; });
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
                    setLikedList(extra)
                })
            )
        )
        return () => {
            db.ref().child(`users/${uid}/following`).off();
            unsubscribe();
        }
    }, [uid, hearts])
    return (
        <div className={classes.Liked}>
            {/**heading */}
            <p style={{ borderBottom: '1px solid #ccc', height: '35px', textAlign: 'center', marginTop: '10px', fontSize: '13px' }}><strong>Likes</strong></p>
            {/**total likes */}
            <div className={classes.Text}><FontAwesomeIcon icon={faHeart} /><p></p>&nbsp;{heartNo}</div>
            <p style={{ textAlign: 'center', color: '#c7c7c7',fontSize:'14px' }}>You can only see the total number of likes on your posts</p>
            {/** scrollable following user list */}
            <div className={classes.scrollLikedList}>
                {likedList ? likedList.map(liked => (
                    <FollowUser key={liked.id} id={liked.id} follow={liked.followed} uid={uid} />
                )) : null}
            </div>
        </div>
    )
}


export default Liked
