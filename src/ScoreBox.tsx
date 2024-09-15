import React from 'react';
import './ScoreBox.css';

function ScoreBox(props: { title: string; score: number }) {
    const { title, score } = props;

    const backgroundColor = '#bbada0';
    const titleColor = '#eee4da';
    const scoreColor = '#ffffff';

    return (
        <div className='score-box' style={{ backgroundColor }}>
            <div className='title' style={{ color: titleColor }}>
                {title}
            </div>
            <div className='score' style={{ color: scoreColor }}>
                {score}
            </div>
        </div>
    );
}

export default ScoreBox;
