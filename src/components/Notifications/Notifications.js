import React, { useEffect, useState } from 'react'
import { db } from '../../firebase';
import classes from './Notifications.module.css';
import FollowUser from '../FollowUser/FollowUser';
function Notifications({ uid,setOpenDropdown}) {
    const [notifications, setNotifications] = useState([]);
    const [followedList, setFollowedList] = useState([]);
    useEffect(() => {
        let unsubscribe = null;
        unsubscribe = (
            db.ref().child(`users/${uid}/notifications`).on("value", snapshot => {
                let data = snapshot ? snapshot.val() : null;
                if (!data || data === 'not set') {
                    return
                }
                let values = Object.entries(data);
                let extra = [];
                values.map(value => (
                    extra.push(value[0])
                ))
                setNotifications(extra);
            })
        )
        return () => {
            db.ref().child(`users/${uid}/notifications`).off();
            unsubscribe();
        }
    }, [uid])
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
                    let notFollowed = notifications.filter(function (obj) { return values.indexOf(obj) === -1; });
                    let Followed = notifications.filter(function (obj) { return values.indexOf(obj) !== -1; });
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
                    setFollowedList(extra)
                })
            )
        )
        return () => {
            db.ref().child(`users/${uid}/following`).off();
            unsubscribe();
        }
    }, [uid, notifications])
    return (
        <div className={classes.Notifications}>
            <div className={classes.scrollLikedList}>
                {followedList ? followedList.map(follow => (
                    <div key={follow.id} className={classes.NotificationsBorder}>
                        <FollowUser setOpenDropdown={setOpenDropdown} id={follow.id} follow={follow.followed} uid={uid} type="notification" />
                    </div>
                )) : null}
            </div>
            {!notifications.length?
            <p style={{textAlign:'center',position:'absolute',top:10,left:0,right:0}}>No Notifications</p>:
            null}
        </div>
    )
}

export default Notifications
