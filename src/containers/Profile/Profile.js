import React, { useState, useEffect } from 'react';
import './Profile.css';
import photo from '../../Assets/Images/vijay-deverakonda-new-hd-wallpapers-high-definition-images-1080p-i3m-700x1050.jpg';
import { db } from '../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTable, faBookmark, faUserCircle, faVideo } from '@fortawesome/free-solid-svg-icons';
import { Route, withRouter, Switch } from 'react-router-dom';
import Link from '../../components/UI/Link/Link';
import UserPosts from '../../components/Posts/UserPosts/UserPosts';
import Saved from '../../components/Saved/Saved';
import UserReels from '../../components/Reels/UserReels/UserReels';
import Follow from '../../components/Follow/Follow';
import OverModal from '../../components/ModaloverModal/OverModalB';
import Aux from '../../hoc/Auxiliary/Auxiliary';
function Profile(props) {
    const { username, uid, loggedIn } = props;
    const { id, displayName } = props.match.params;
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [followerNo, setFollowerNo] = useState(null);
    const [followingNo, setFollowingNo] = useState(null);
    const [postsNo, setPostsNo] = useState(null);
    const [followType, setFollowType] = useState(null);
    const [openOverModal, setOpenOverModal] = useState(false);
    useEffect(() => {
        let unsubscribe = null;
        unsubscribe = (
            db.ref().child(`users/${id === uid ? uid : id}`).on("value", snapshot => {
                let data = snapshot ? snapshot.val() : null;
                if (!data) {
                    setPostsNo(0)
                    return
                }
                let followers = (data.followers && data.followers !== 'not set') ? Object.keys(data.followers) : null;
                let following = (data.following && data.following !== 'not set') ? Object.keys(data.following) : null;
                setFollowers(followers);
                setFollowing(following);
                let postno = (data.posts && data.posts !== 'not set') ? Object.keys(data.posts) : 0;
                setFollowerNo(followers ? followers.length : "0");
                setFollowingNo(following ? following.length : "0");
                if (postno) {
                    setPostsNo(postno.length)
                }
            })
        )
        return () => {
            db.ref().child(`users/${id === uid ? uid : id}`).off();
            unsubscribe()
        }
    }, [uid, id])
    const openModal = (type) => {
        setOpenOverModal(true);
        setFollowType(type);
    }
    const closeModalHandler = () => {
        setOpenOverModal(false)
    }
    const closeBackdropHandler = () => {
        setOpenOverModal(false)
    }
    return (
        <div className="profile">
            {openOverModal && followType ?
                <OverModal modalClosed={closeBackdropHandler}
                    clicked={closeModalHandler}
                    show={openOverModal}>
                    <Follow uid={uid} follow={followType === 'followers' ? followers : following} followType={followType} />
                </OverModal> : null}
            {/**user section */}
            <div className="profile_user">
                <div className="extra_container">
                    <div className="profile_image_container">
                        <img className="profile_image" src={photo} alt="profile_pic" />
                    </div>
                </div>
                <div className="profile_bio">
                    <div className="settings">
                        <div className="displayname">{displayName === username ? username : displayName}</div>
                        <div className="settings_right">
                            <button className="edit_profile_button" >Edit profile</button>
                            <FontAwesomeIcon icon={faCog} />
                        </div>
                    </div>
                    <div className="follow">
                        <div className="text">
                            <strong>{postsNo ? postsNo : "0"}</strong> posts
                        </div>
                        <div onClick={() => openModal('followers')} className="text">
                            <strong>{followerNo ? followerNo : null}</strong> followers
                        </div>
                        <div onClick={() => openModal('following')} className="text">
                            <strong>{followingNo ? followingNo : null}</strong> following
                        </div>
                    </div>
                    <div className="bio">
                        <p><strong>{displayName === username ? username : displayName}</strong></p>
                        <p className="text">
                            bio here
                        </p>
                    </div>
                </div>
            </div>
            {/**bio */}
            <div className="profile_browsing">
                <Link icon={faTable} link={"/p/" + id + "/" + displayName + "/posts"}>POSTS</Link>
                <Link icon={faVideo} link={"/p/" + id + "/" + displayName + "/reels"} exact>&nbsp; REELS</Link>
                {id === uid ? <Link icon={faBookmark} link={"/p/" + id + "/" + displayName + "/saved"} exact>SAVED</Link> : null}
                {id === uid ? <Link icon={faUserCircle} link={"/p/" + id + "/" + displayName + "/tagged"} exact>TAGGED</Link> : null}
            </div>
            <div className="profile_browsed_contentHere">
                <Switch >
                    <Route path={"/p/:id/:displayName/posts"}>
                        {postsNo>0?
                        <UserPosts uid={uid} loggedIn={loggedIn} username={username} id={id} displayName={displayName} />
                        :<p style={{marginTop:'28px',textAlign:'center'}}>No posts yet</p>}
                        
                    </Route>
                    <Route path="/p/:id/:displayName/reels">
                        <UserReels uid={uid} id={id} loggedIn={loggedIn} username={username} />
                    </Route>
                    {id === uid ? (
                        <Aux>
                            <Route path={"/p/" + id + "/" + displayName + "/saved"} exact>
                                <Saved id={uid} />
                            </Route>
                            <Route path={"/p/" + id + "/" + displayName + "/tagged"} exact>
                                <div style={{textAlign:'center',marginTop:'28px'}}>
                                    Tagging Feature not covered yet
                                </div>
                            </Route>
                        </Aux>) : null}
                </Switch>

            </div>
            {/**browsing */}
            {/**user posts */}
        </div>
    )
}

export default withRouter(Profile);
