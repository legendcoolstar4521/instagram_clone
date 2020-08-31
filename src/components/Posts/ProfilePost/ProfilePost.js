import React from 'react';
import loadingImage from '../../../Assets/Images/loading.jpg';
import Aux from '../../../hoc/Auxiliary/Auxiliary';
import classes from './ProfilePost.module.css';
function ProfilePost({  imageUrl }) {
    return (
        <Aux>
            <div className={classes.post} >
                <img className={classes.post_image} src={imageUrl ? imageUrl : loadingImage} alt="" />
            </div>
        </Aux>
    )
}

export default ProfilePost;
