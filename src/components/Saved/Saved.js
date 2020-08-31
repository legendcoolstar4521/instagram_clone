import React, { Component } from 'react';
import classes from './Saved.module.css';
import Post from '../../components/Posts/Post/Post';
import { db } from '../../firebase';
import axios from 'axios';
import ModalB from '../ModalB/ModalB';
import ProfilePost from '../Posts/ProfilePost/ProfilePost';
import { withRouter } from 'react-router-dom';
class Saved extends Component {
    _isMounted = false
    state = {
        dad: [],
        showPost: false,
        savedList: null,
        post: null,
        postId: null
    }
    componentDidMount() {
        this._isMounted = true;
        const { id } = this.props;
        if (this._isMounted) {
            db.ref().child(`users/${id}/saved`).on("value", snapshot => {
                let data = snapshot ? snapshot.val() : null;
                if (!data || data==="not set") {
                    return;
                }
                let values = Object.entries(data)
                let waste = [];
                values.map(value => {
                    return (waste.push({
                        posterId: value[1],
                        postId: value[0]
                    }))
                })
                waste.map(wast => (
                    axios.get('https://instagram-clone-ff041.firebaseio.com/users/' + wast.posterId + '/posts/' + wast.postId + '.json').then(res => {
                        let datas = res.data;
                        if (!datas || datas === 'not set') {
                            return;
                        }
                        let extra = [];
                        extra.push({
                            id: wast.postId,
                            post: datas,
                            followedId: wast.posterId
                        })
                        if (Array.isArray(extra) && extra.length) {
                            let fal = [...extra, ...this.state.dad];
                            let jsonObject = fal.map(JSON.stringify);

                            let uniqueSet = new Set(jsonObject);
                            let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                            if (this._isMounted)
                                this.setState({ dad: uniqueArray })
                        }
                    })
                ))
                db.ref().child(`users/${id}/saved`).on("value", snapshot => {
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
            })
        }
    }
    showModal = (post, id, followedId) => {
        this.setState(prevState => {
            return {
                show: !prevState.show,
                post: post,
                postId: id,
                followedId: followedId
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
        this.props.history.replace('/profile/saved')
    }
    componentWillUnmount() {
        db.ref().child(`users/${this.props.id}/saved`).off()
        this._isMounted = false;
    }
    render() {

        let showPost = null;
        if (this.state.show && this.state.post && this.state.postId && this.state.savedList && this.state.followedId) {
            showPost = (
                <ModalB modalClosed={this.closeBackdropHandler}
                    clicked={this.closeModalHandler}
                    show={this.state.show} >
                    <Post
                        uid={this.props.id}
                        loggedIn={this.props.loggedIn}
                        postId={this.state.postId}
                        username={this.state.post.username}
                        caption={this.state.post.caption}
                        imageUrl={this.state.post.imageUrl}
                        savedList={this.state.savedList}
                        followedId={this.state.followedId} />
                </ModalB>)
        }
        return (
            <div className={classes.Saved} >
                {
                    (Array.isArray(this.state.dad) && this.state.dad.length) ?
                        this.state.dad.map(({ id, post, followedId }) => {
                            return (<div key={id} onClick={() => this.showModal(post, id, followedId)}>
                                <ProfilePost postId={id} post={post} uid={this.props.id} imageUrl={post.imageUrl} />
                            </div>)
                        })
                        : <center><p style={{ position:'absolute',left:0 ,right:0,marginTop:'20px'}}>Nothing saved yet</p></center>}
                {showPost}
            </div>
        );
    }
}

export default withRouter(Saved);
