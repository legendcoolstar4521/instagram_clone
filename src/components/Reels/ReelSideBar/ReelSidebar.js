import React, { useState, useEffect } from 'react'
import './ReelSidebar.css';
import { withRouter } from 'react-router-dom';
import CommentIcon from '@material-ui/icons/Comment';
import ShareIcon from '@material-ui/icons/Share';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faHeart } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../../firebase';
function ReelSidebar(props) {
    const { uid, followedId, postId } = props;
    const [liked, setLiked] = useState(false)
    const [heartNo, setHeartNo] = useState(0);
    const [hearts, setHearts] = useState([]);
    const goThere = () => {
        let ret = props.match.url.replace('reels', '');
        props.history.push(ret + "posts");
    }
    const submitHeart = (isLiked) => {
        if (uid) {
            if (!isLiked) {
                db.ref().child(`users/${followedId === uid ? uid : followedId}/reels/${postId}/hearts/${uid}`).set(true)
            }
            else {
                db.ref().child(`users/${followedId === uid ? uid : followedId}/reels/${postId}/hearts/${uid}`).remove()
                    .then(
                        res => {
                            setLiked(false)
                            setHeartNo(prevState => prevState - 1)
                            let position = hearts.indexOf(uid)
                            setHearts(prevState => prevState.splice(1, position))
                        }
                    );
            }
        }
    }
    useEffect(() => {
        if (postId) {
            db.ref().child(`users/${followedId === uid ? uid : followedId}/reels/${postId}/hearts`).on("value", snapshot => {
                let data = snapshot ? snapshot.val() : null;
                if (!data) {
                    console.log("HASbd")
                    return;
                }
                let values = Object.entries(data);
                const postData = [];
                values.map(value => {
                    return postData.push(value[0])
                })
                console.log(values)
                let isLiked = postData.indexOf(uid) !== -1;
                setLiked(isLiked)
                setHeartNo(postData.length);
                setHearts(postData);
            })
        }
        return () => {
            db.ref().child(`users/${followedId ? followedId : uid}/posts/${postId}/hearts`).off();
        }
    }, [postId, followedId, uid])
    return (
        <div className="reelSidebar">
            <div className="closeReel" onClick={() => goThere()}>
                <FontAwesomeIcon icon={faTimesCircle} />
            </div>
            <div onClick={() => submitHeart(liked)} className="reelSidebar_button" >
                <FontAwesomeIcon icon={faHeart} style={{fontSize:'25px',color: liked ? "red" : "whitesmoke" }} />
                <p>{heartNo}</p>
            </div>
            <div className="reelSidebar_button">
                <CommentIcon />
                <p>300</p>
            </div>
            <div className="reelSidebar_button">
                <ShareIcon />
                <p>300</p>
            </div>
        </div>
    )
}

export default withRouter(ReelSidebar);
