import React, { useState, useRef, useEffect } from 'react';
import { ReactMediaRecorder } from "react-media-recorder";
import { storage, db } from '../../firebase';
import axios from 'axios';
import './Vidrec.css';
const VideoPreview = ({ stream }) => {
    const videoRef = useRef(HTMLVideoElement);
    const [stop, setStop] = useState(true);
    const stopIt = () => {
        setStop(prevState => !prevState)
        if (!stop) {
            videoRef.current.play()
        }
        else {
            videoRef.current.pause()
        }
    }
    useEffect(() => {
        if (!stream) {
            return;
        }
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    if (!stream) {
        return null;
    }
    return <video ref={videoRef} width='100%' height={470} autoPlay onClick={() => stopIt()} />;
};

const Vidrec = ({ uid }) => {
    const [progress, setProgress] = useState(0);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [getBLOB, setGetBLOB] = useState(null);
    const [video, setVideo] = useState(null);
    const [preview, setPreview] = useState(null);
    const [caption,setCaption] = useState('')
    const discard = (clearBlobUrl, stopRecording, previewStream) => {
        clearBlobUrl();
        setPreview(null);
        setVideo(null);
        stopRecording();
        const tracks = previewStream.getTracks();
        tracks.forEach(function (track) {
            track.stop();
        });
    }
    const changeHandler = (e, stopRecording, clearBlobUrl) => {
        clearBlobUrl();
        stopRecording();
        if (e.target.files[0]) {
            setVideo(e.target.files[0]);
        }
    }
    useEffect(() => {
        if (!video) {
            return
        }
        const objectUrl = URL.createObjectURL(video)
        setPreview(objectUrl)
        // free memoriy when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [video])
    const handleUpload = (mediaBlobUrl, stopRecording, clearBlobUrl) => {
        setDownloadUrl(mediaBlobUrl)
    }
    useEffect(() => {
        if (downloadUrl) {
            axios.get(downloadUrl, {
                responseType: 'arraybuffer',
                headers: {
                    'Accept': 'video/mp4'
                }
            }).then(response => {
                console.log(response);
                // response.data is an empty object
                const blob = new Blob([response.data], {
                    type: 'video/mp4',
                });
                setGetBLOB(blob)
            });
        }
    }, [downloadUrl])
    useEffect(() => {
        if (getBLOB) {
            const rand = Math.random()
            const uploadTask = storage.ref(`videos/${rand}`).put(getBLOB);
            uploadTask.on(
                "state_changed", snapshot => {
                    //progress funtion...
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    storage.ref("videos")
                        .child(rand.toString())
                        .getDownloadURL()
                        .then(url => {
                            db.ref().child(`users/${uid}/reels`).push({
                                videoUrl: url,
                                caption:caption
                            })
                            alert("Uploaded")
                            setProgress(0);
                            setPreview(null);
                            setVideo(null);
                            setGetBLOB(null);
                        })
                }
            )
        }
    }, [getBLOB, uid,caption])
    const begin = (startRecording, clearBlobUrl) => {
        startRecording();
        clearBlobUrl();
        setVideo(null)
    }
    return (
        <ReactMediaRecorder
            video
            render={({ previewStream, status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl }) => {
                return (
                    <div>
                        {!video ? mediaBlobUrl ? <video src={mediaBlobUrl} controls autoPlay loop width='100%' height={470} /> :
                            <VideoPreview stream={previewStream} /> : <video src={preview} height={470} width={'100%'} autoPlay loop controls />}
                        {progress > 0 ? <progress className="imageUpload_progress" value={progress} max="100" /> : null}
                        <div className="videoControlsHandler" style={{ display: 'flex', flexWrap: 'wrap' }}>
                            <p>{status}</p>
                            <button className="videoControlButton" onClick={() => begin(startRecording, clearBlobUrl)}>Start</button>
                            <button className="videoControlButton" onClick={() => stopRecording()}>Stop</button>
                            {mediaBlobUrl ? <a className="videoControlButton" href={mediaBlobUrl}>Download</a> :
                                <p className="videoControlButton" onClick={() => alert('Please record a video first')}>Download</p>}
                            {mediaBlobUrl ? <div><button className="videoControlButton" onClick={() => handleUpload(mediaBlobUrl)} >Upload</button>
                            </div> : null}

                            <button className="videoControlButton" onClick={() => discard(clearBlobUrl, stopRecording, previewStream)}>Discard</button>
                            <input type="file" accept="video/*" onChange={(e) => changeHandler(e, stopRecording, clearBlobUrl)} />
                        </div>
                        <input type="text" className="reelUpload_caption" placeholder="caption" onChange={(e) => setCaption(e.target.value)} value={caption} />
                    </div>)
            }}
        />
    )
};
export default Vidrec;