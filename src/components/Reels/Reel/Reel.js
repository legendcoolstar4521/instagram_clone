import React, { useRef, useState, useEffect } from 'react';
import './Reel.css';
import ReelFooter from '../ReelFooter/ReelFooter';
import ReelSidebar from '../ReelSideBar/ReelSidebar';

function Reel({ stop, mp, play,username,audio,caption,uid,id,postId }) {
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef(null);

    const onVideoPress = () => {
        if (playing) {
            videoRef.current.pause();
            setPlaying(false)
        }
        else {
            videoRef.current.play();
            setPlaying(true);
        }
    }
    useEffect(() => {
        if (stop) {
            videoRef.current.pause();
        }
        else {
            if (play) {
                videoRef.current.play();

            }
            else {
                videoRef.current.pause();
            }
        }
    }, [stop, play])
    return (
        <div className="video" >
            <video
                loop
                onClick={onVideoPress}
                ref={videoRef}
                className="video_player" src={mp} alt=""></video>
            <ReelFooter username={username} audio={audio?audio:null} caption={caption?caption:null} />
            <ReelSidebar uid={uid} id={id} postId={postId} followedId={id}/>
            {/**Reel Sidebar */}
        </div>
    )
}

export default Reel
