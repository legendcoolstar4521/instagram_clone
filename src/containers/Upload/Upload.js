import React, {  useState } from 'react';
import classes from './Upload.module.css';
import ImageUpload from '../../components/ImageUpload/ImageUpload';
import Vidrec from '../../components/VideoRecorder/Vidrec';
import { faImage, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
function UploadFile({ uid, username }) {
    const [isImage, setIsImage] = useState(true);
    const selectUploadType = (type) => {
        if (type === 'feed') {
            setIsImage(true)
        }
        else if (type === 'reel') {
            setIsImage(false)
        }
    }
    return (
        <div className={classes.Upload}>
            <div className={classes.PreviewSection}>
                {isImage ?
                    <ImageUpload username={username} uid={uid} />
                    :
                    <Vidrec username={username} uid={uid} />
                }
            </div>
            <div className={classes.UploadSelectSection}>
                <div className={classes.postTypeIcon} onClick={() => selectUploadType('feed')}>
                    <FontAwesomeIcon color={isImage ? '#4dafff' : 'black'} icon={faImage} />
                    <p> Post</p>
                </div>
                <div className={classes.postTypeIcon} onClick={() => selectUploadType('reel')}>
                    <FontAwesomeIcon color={isImage ? 'black' : '#4dafff'} icon={faVideo} />
                    <div> Reel</div>
                </div>
            </div>
        </div>
    )
}

export default UploadFile;
