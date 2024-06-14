import React from 'react'
import '../assets/intro.css'
import { Navigate, useNavigate } from 'react-router-dom'
function intro() {
    const navigate =useNavigate();
    const handleClick=()=>{
        const token= localStorage.getItem('token');
        token ?navigate('/video'):navigate('/login');
    }
    return (
        <div>
            <div className="intro">
                <h1>WATCHALONG</h1>
                <p>Experience the joy of watching videos or movies with friends, no matter where they are, with our innovative platform. Whether you prefer video calls or voice calls, our website brings you and your friends together in a virtual theater-like environment.
                    With our easy-to-use interface and seamless integration of video and voice calls, connecting and sharing moments has never been more immersive.
                    Join us today and elevate your movie-watching experience to a whole new level. Create memories, share laughs, and enjoy unforgettable moments with friends, all from the comfort of your own home.
                    Let's watch together, no distance can keep us apart!
                </p>
                <button onClick={handleClick}>Get Started</button>
            </div>
        </div>
    )
}

export default intro
