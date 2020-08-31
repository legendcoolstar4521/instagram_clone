import React, { useState, useEffect } from 'react'
import { Button } from '@material-ui/core'
import { storage, db } from '../../firebase';
import './ImageUpload.css';
function ImageUpload({ username, uid }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');
    const [preview, setPreview] = useState(null)
    const timestamp = Date(Date.now);
    const handleChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    useEffect(() => {
        if (!image) {
            return
        }
        const objectUrl = URL.createObjectURL(image)
        setPreview(objectUrl)
        // free memoriy when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [image])
    const handleUpload = () => {
        if (image) {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
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

                    storage.ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then(url => {
                            db.ref().child(`users/${uid}/posts`).push({
                                timestamp: timestamp,
                                caption: caption,
                                imageUrl: url,
                                username: username
                            })
                        }).then(res => {
                            setImage(null);
                            setProgress(0);
                            setCaption('');
                            setPreview(null);
                            alert('uploaded')
                        })
                }
            )
        }
        else {
            return alert("Please select a picture")
        }
    }
    return (
        <div className="imageUpload">
            {progress > 0 ? <progress className="imageUpload_progress" value={progress} max="100" /> : null}
            <div className="imagePreviewer">
                {preview ? <img src={preview} alt="" className="imagePreview" /> : <p>Preview</p>}
            </div>
            <input type="text" className="imageUpload_caption" placeholder="caption" onChange={(e) => setCaption(e.target.value)} value={caption} />
            <input type="file" onChange={(e) => handleChange(e)} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
