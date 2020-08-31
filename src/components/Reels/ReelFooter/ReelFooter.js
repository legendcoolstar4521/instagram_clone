import React from 'react';
import './ReelFooter.css';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import Ticker from 'react-ticker';
function ReelFooter({ username, audio, caption }) {
    return (
        <div className='reelFooter'>
            <div className="reelFooter_text">
                <h3>@{username}</h3>
                <p style={{ marginTop: '5px', marginBottom: '5px' }}>{caption}</p>
                <div className="reelFooter_ticker">
                    <MusicNoteIcon style={{marginTop:'5px'}} />
                    <Ticker mode="smooth">
                        {({ index }) => (
                            <p>Audio will come here{audio}</p>
                        )}
                    </Ticker>
                </div>
            </div>
            <div className="outer">
                <div className="outerCover"></div>
                <div className="cover"></div>
                <div className="inner">
                    <div className="superInner"></div>
                </div>
                <div className="cover"></div>
                <div className="outerCover"></div>
            </div>
        </div>
    )
}

export default ReelFooter;
