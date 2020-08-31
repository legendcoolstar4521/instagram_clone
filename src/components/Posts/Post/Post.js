import React, { useEffect, useState } from 'react'
import './Post.css';
import Avatar from '@material-ui/core/Avatar';
import loadingImage from '../../../Assets/Images/loading.jpg';
import { Link } from 'react-router-dom';
import { db } from '../../../firebase';
import { Button } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faBookmark, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import OverModal from '../../ModaloverModal/OverModalB';
import ModalB from '../../ModalB/ModalB';
import Liked from '../../Liked/Liked';
function Post(props) {
    let { id,followedId, uid, postId, displayName, username, caption, imageUrl, savedList } = props;
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [hearts, setHearts] = useState([]);
    const [heartNo, setHeartNo] = useState(null);
    const [liked, setLiked] = useState(false);
    const [openOverModal, setOpenOverModal] = useState(false);
    const [openModalB, setOpenModalB] = useState(false);
    const [saved, setSaved] = useState(false);
    const timestamp = Date(Date.now);
    useEffect(() => {
        let unsubscribe = null;
        if (postId) {
            if (savedList) {
                let checkSave = savedList.indexOf(postId) !== -1;
                setSaved(checkSave)
            }
            unsubscribe = db.ref().child(`users/${followedId ? followedId : uid}/posts/${postId}/comments`).orderByChild('timestamp').on("value", snapshot => {
                let data = snapshot ? snapshot.val() : null;
                if (!data) {
                    return;
                }
                let values = Object.entries(data);
                const postData = [];
                values.map(value => {
                    return postData.push({
                        id: value[0],
                        comment: value[1],
                        followedId: followedId
                    })
                })
                setComments(postData);
            })
        }
        return () => {
            db.ref().child(`users/${followedId ? followedId : uid}/posts/${postId}/comments`).orderByChild('timestamp').off();
            unsubscribe();
        }
    }, [postId, followedId, uid, savedList])
    useEffect(() => {
        let unsubscribe = null;
        console.log(followedId,postId,uid)
        if (postId) {
            unsubscribe = db.ref().child(`users/${id ? id :followedId ? followedId : uid}/posts/${postId}/hearts`).on("value", snapshot => {
                let data = snapshot ? snapshot.val() : null;
                if (!data) {
                    return;
                }
                let values = Object.entries(data);
                const postData = [];
                values.map(value => {
                    return postData.push(value[0])
                })
                let isLiked = postData.indexOf(uid) !== -1;
                
                setLiked(isLiked)
                setHeartNo(postData.length);
                setHearts(postData);
            })
        }
        return () => {
            db.ref().child(`users/${followedId ? followedId : uid}/posts/${postId}/hearts`).off();
            unsubscribe();
        }
    }, [postId, followedId, uid,id])
    const submitComment = () => {
        if (uid && comment !== '') {
            db.ref().child(`users/${followedId ? followedId : uid}/posts/${postId}/comments`).push({
                text: comment,
                username: displayName,
                timestamp: timestamp,
            })
            //comment posted
        }
    }
    const savePost = (isSaved) => {
        if (uid) {
            if (!isSaved) {
                let selectedId = followedId ? followedId.toString() : uid;
                db.ref().child(`users/${uid}/saved/${postId}`).set(selectedId)
            }
            else {
                db.ref(`users/${uid}/saved/${postId}`).remove().then(
                    res => {
                        setSaved(false)
                    }
                )
            }
        }
    }
    const submitHeart = (isLiked) => {
        if (uid) {
            if (!isLiked) {
                db.ref().child(`users/${id?id:followedId ? followedId : uid}/posts/${postId}/hearts/${uid}`).set(true)
            }
            else {
                db.ref().child(`users/${followedId ? followedId : uid}/posts/${postId}/hearts/${uid}`).remove()
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
    const deleteComment = (id, followedId) => {
        const ref = db.ref(`users/${followedId ? followedId : uid}/posts/${postId}/comments/${id}`);
        ref.remove();
        let fafu = comments.filter(comment => {
            return comment.id !== id
        })
        setComments(fafu)
    }
    const deletePostHandler =()=>{
        db.ref().child(`users/${uid}/posts/${postId}`).remove();
        setOpenModalB(false);
    }
    const openModal = () => {
        setOpenOverModal(true);
    }
    const closeModalHandler = () => {
        setOpenOverModal(false)
    }
    const closeBackdropHandler = () => {
        setOpenOverModal(false)
    }
    const openItModalB = () => {
        setOpenModalB(true);
    }
    const closeModalHandlerB = () => {
        setOpenModalB(false)
    }
    const closeBackdropHandlerB = () => {
        setOpenModalB(false)
    }
    return (
        <div className="post">
            {openOverModal ?
                <OverModal modalClosed={closeBackdropHandler}
                    clicked={closeModalHandler}
                    show={openOverModal}>
                    <Liked uid={uid} heartNo={heartNo} hearts={hearts} />
                </OverModal> : null}
            {openModalB ?
                <ModalB modalClosed={closeBackdropHandlerB}
                    clicked={closeModalHandlerB}
                    show={openModalB} >
                    <div style={{display:'flex',flexDirection:'column'}}>
                        {followedId?followedId===uid?<button onClick={()=>deletePostHandler()} className="postSettings_Button">Delete</button>:null:
                        <button onClick={()=>deletePostHandler()} className="postSettings_Button">Delete</button>}
                        <button onClick={()=>alert("Report feature is not available yet")} className="postSettings_Button">Report</button>
                    </div>
                </ModalB> : null}
            <div className="post_header">
                <div className="user_post_details">
                    <Avatar
                        className="post_avatar"
                        alt="IconDev"
                        src="/static/images/avatar/1.jpg" />
                    <Link style={{ fontSize: '15px', fontWeight: '600', textDecoration: 'none', color: '#484848' }}
                        to={followedId === uid ? "/p/" + uid + "/" + username : "/p/" + followedId + "/" + username} >
                        {username}
                    </Link>
                </div>
                <div className="user_post_options">
                    <FontAwesomeIcon icon={faEllipsisV} onClick={()=>openItModalB()}/>
                </div>

            </div>
            {/**Header-> avatar + username */}
            <img className="post_image" src={imageUrl ? imageUrl : loadingImage} alt="" />
            {/**Image */}
            <div className="post_like_and_save">
                <div onClick={() => submitHeart(liked)}>
                    <FontAwesomeIcon icon={faHeart} color={liked ? "red" : "#c7c7c7"} />
                </div>
                <div onClick={() => savePost(saved)}>
                    <FontAwesomeIcon icon={faBookmark} color={saved ? "black" : "#c7c7c7"} />
                </div>
            </div>
            <div className="post_LikesNo"> {heartNo ? <div>Liked by {heartNo}</div> : null}<div> {heartNo >= 2 ? <div style={{ display: 'flex' }}><div>&nbsp; and</div> <div onClick={() => openModal()}><strong>&nbsp;others</strong></div></div> : null}</div></div>
            {/**Like and save feature */}
            <div className="post_caption">
                <h4 ><strong>{username}</strong></h4>
                <p className="post_text">{caption}</p>
            </div>
            {/**username + caption */}
            <div className="post_comments">
                {comments ? comments.map(({ id, comment, followedId }) => (
                    <div key={id} className="post_comment">
                        <div className="post_comment_user">
                            <h4 ><strong>{comment.username}</strong></h4>
                            <p className="post_text">{comment.text}</p>
                        </div>
                        <div className="post_comment_icon">
                            {(comment.username === displayName) ? <FontAwesomeIcon onClick={() => deleteComment(id, followedId)} style={{ float: 'right' }} icon={faTrash} color="#c7c7c7" /> :
                                <FontAwesomeIcon style={{ float: 'right' }} icon={faHeart} color="#c7c7c7" />}
                        </div>
                    </div>
                )) : null}
            </div>
            <div className="post_addcommentDiv">
                <form className="post_commentForm" onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="post_commentInput"
                        type="text"
                        placeholder="Add a comment here"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button onClick={() => submitComment()}>Add</Button>
                </form>
            </div>
        </div>
    )
}

export default Post
