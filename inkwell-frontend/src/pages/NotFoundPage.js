import React from 'react';
import '../css/NotFoundPage.css';
import WatercolorBackground from '../components/WatercolorBackground';

const NotFoundPage = () => {
    return (
        <><WatercolorBackground /><div className='not-found-container'>
            <h1>Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
        </div></>
    );
};



export default NotFoundPage;