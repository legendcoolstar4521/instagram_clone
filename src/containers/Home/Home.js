import React, { Component } from 'react';
import './Home.css';
import Post from '../../components/Posts/Post/Post';
import { db } from '../../firebase';
import Follow from '../Follow/Follow';
import axios from 'axios';
import Spinner from '../../components/UI/Spinner/Spinner';
class Home extends Component {
    _isMounted = false
    state = {
        posts: [],
        dad: [],
        savedList: null
    }
    componentDidMount() {
        this._isMounted = true;
        const { uid } = this.props;
        if (this._isMounted) {
            db.ref().child(`users/${uid}/following`).on("value", snapshot => {
                let data = snapshot ? snapshot.val() : null;
                if (!data) {
                    return;
                }
                let val = Object.keys(data)
                for (let key in val) {
                    let followingid = val[key];
                    axios.get('https://instagram-clone-ff041.firebaseio.com/users/' + followingid + '/posts.json').then(res => {
                        let datas = res.data;
                        if (!datas || datas === 'not set') {
                            return;
                        }
                        let extra = [];
                        let values = Object.entries(datas);
                        values.map(value => (
                            extra.push({
                                id: value[0],
                                post: value[1],
                                followedId: [followingid]
                            })
                        ))
                        if (Array.isArray(extra) && extra.length) {
                            let fal = [...extra, ...this.state.dad];
                            let jsonObject = fal.map(JSON.stringify);

                            let uniqueSet = new Set(jsonObject);
                            let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
                            if (this._isMounted)
                                this.setState({ dad: uniqueArray })
                        }
                    })
                }
            })
            db.ref().child(`users/${uid}/saved`).on("value", snapshot => {
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
        this._isMounted = false;
        db.ref().child(`users/${this.props.uid}/saved`).off();
        db.ref().child(`users/${this.props.uid}/following`).off();
    }
    render() {
        return (
            <div className="app" >
                <div className="home_main">
                    <div className="app_posts">
                        {(this.props.loggedIn || this.props.uid) && this.state.savedList ?
                            this.state.dad.map(({ id, post, followedId }, index) => (
                                <Post
                                    uid={this.props.uid}
                                    followedId={followedId}
                                    key={index}
                                    loggedIn={this.props.loggedIn}
                                    postId={id}
                                    displayName={this.props.username}
                                    username={post.username}
                                    caption={post.caption}
                                    imageUrl={post.imageUrl}
                                    savedList={this.state.savedList} />
                            )) : <Spinner />
                        }
                    </div>
                    <div className="home_follow_manager">
                        {this.props.loggedIn ? <Follow uid={this.props.uid} username={this.props.username} loggedIn={this.props.loggedIn} /> : null}
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
