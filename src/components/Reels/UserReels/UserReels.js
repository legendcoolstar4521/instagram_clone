import React, { useState, useEffect } from 'react';
import './UserReels.css';
import Reel from '../Reel/Reel';
import { withRouter } from 'react-router-dom';
import ReelModal from '../../ReelModal/ReelModal';
import { db } from '../../../firebase';
function UserReels({ id, uid, username }) {
    const [stop, setStop] = useState(false);
    const [playNo, setPlayNo] = useState(1);
    const [noReels, setNoReels] = useState(false);
    const openOverModal = true;
    const [srcs, setSrcs] = useState([]);
    const elementScrollData = (e) => {
        let element = e.target
        let bal = parseInt(element.scrollTop)
        if (bal > 631) {
            let divi = element.scrollTop / 631;
            let divisor = parseInt(divi)
            bal = parseInt(element.scrollTop - divisor * 631);
            setPlayNo(divisor + 1);
        }
        else if (bal < 631) {
            setPlayNo(1)
        }
        if (630 - bal <= 2) {
            // do something at end of scroll
            setStop(true);
        }
        else {
            setStop(false);

        }
    }
    useEffect(() => {
        db.ref().child(`users/${id === uid ? uid : id}/reels`).on("value", snapshot => {
            let data = snapshot ? snapshot.val() : null;
            if (!data || data === 'not set') {
                setNoReels(true);
                return
            }
            let values = Object.entries(data);
            let extra = [];
            values.map(value => (
                extra.push({
                    data: value[1],
                    postId: value[0]
                })
            ))
            setSrcs(extra);
        })
        return () => {
            db.ref().child(`users/${id === uid ? uid : id}/reels`).off();
        }
    }, [uid, id])
    return (
        <div className="userReels">

            {openOverModal && srcs.length ?
                <ReelModal
                    show={openOverModal}>
                    <div className="userReels_videos" onScroll={(e) => elementScrollData(e)} >
                        {srcs.length ? srcs.map((src, index) => (
                            <div key={index} style={{ width: '100%', height: '100%', scrollSnapType: 'y mandatory' }} >
                                <Reel
                                    stop={stop}
                                    mp={src.data.videoUrl}
                                    play={playNo === index + 1 ? true : false}
                                    username={username}
                                    audio={src.data.audio ? src.data.audio : null}
                                    caption={src.data.caption ? src.data.caption : null}
                                    uid={uid}
                                    id={id}
                                    postId={src.postId} />
                            </div>
                        )) : null}
                    </div>
                </ReelModal> : null}
            {noReels ? <p style={{ marginTop: '30px' }}>No Reels uploaded yet</p> : null}
        </div>
    );
}

export default withRouter(UserReels);
