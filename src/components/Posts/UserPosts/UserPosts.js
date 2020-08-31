import React, { Component } from 'react'
import { db } from '../../../firebase';
import ProfilePost from '../ProfilePost/ProfilePost';
import classes from './UserPosts.module.css';
import ModalB from '../../ModalB/ModalB';
import Post from '../Post/Post';
import { withRouter } from 'react-router-dom';
class UserPosts extends Component {
    _isMounted = false;
    state = {
        userPosts: [],
        show: false,
        post: null,
        postId: null,
        saveList: null,
        followedId: null
    }
    componentDidMount() {
        const { id, uid } = this.props;
        this._isMounted = true;
        if (this._isMounted) {
            db.ref().child(`users/${id === uid ? uid : id}/posts`).on("value", snapshot => {
                let data = snapshot ? snapshot.val() : null;
                if (!data || data === 'not set') {
                    this.setState({ userPosts: [] })
                    return;
                }
                let values = Object.entries(data)
                let extra = [];
                values.map(value => (
                    extra.push({
                        id: value[0],
                        post: value[1]
                    })
                ))
                this.setState({
                    userPosts: extra
                })
            })
            db.ref().child(`users/${id === uid ? uid : id}/saved`).on("value", snapshot => {
                let data = snapshot ? snapshot.val() : null;
                if (!data || data === 'not set') {
                    let empty = [];
                    this.setState({ savedList: empty })
                    return;
                }
                let values = Object.entries(data)
                let waste = [];
                values.map(value => {
                    return (waste.push(value[0]))
                })
                this.setState({ savedList: waste });
            })
        }
    }
    componentWillUnmount() {
        const { id, uid } = this.props;
        db.ref().child(`users/${id === uid ? uid : id}/posts`).off();
        db.ref().child(`users/${id === uid ? uid : id}/saved`).off();
        this._isMounted = false;
    }
    showModal = (post, id) => {
        this.setState(prevState => {
            return {
                show: !prevState.show,
                post: post,
                postId: id
            }
        })
    }
    closeModalHandler = () => {
        this.setState({
            show: false,
            post: null,
            postId: null
        })
    }
    closeBackdropHandler = () => {
        this.setState({
            show: false,
            post: null,
            postId: null
        })
    }
    render() {
        console.log(this.state.postId)
        let showPost = null;
        if (this.state.show && this.state.post && this.state.postId && this.state.savedList) {
            showPost = (
                <ModalB modalClosed={this.closeBackdropHandler}
                    clicked={this.closeModalHandler}
                    show={this.state.show} >
                    <Post
                        id={this.props.id}
                        uid={this.props.uid}
                        loggedIn={this.props.loggedIn}
                        postId={this.state.postId}
                        username={this.state.post.username}
                        caption={this.state.post.caption}
                        imageUrl={this.state.post.imageUrl}
                        savedList={this.state.savedList}
                        displayName={this.props.username} />
                </ModalB>)
        }
        return (
            <div className={classes.userPosts} >
                {
                    (Array.isArray(this.state.userPosts) && this.state.userPosts.length) ?
                        this.state.userPosts.map(({ id, post }) => {
                            return (<div key={id} onClick={() => this.showModal(post, id)}>
                                <ProfilePost postId={id} post={post} uid={this.props.uid} imageUrl={post.imageUrl} />
                            </div>)
                        })
                        : null}
                {showPost}
            </div >
        )
    }
}

export default withRouter(UserPosts);
