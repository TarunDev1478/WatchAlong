import React from 'react'
import '../assets/home.css'
import Navbar from './Navbar'
import Intro from './intro'

function Home() {
  return (
    <div className='home'>
      <div className="faid"></div>
      <div className="content">
        <Navbar/>
        <Intro/>
        <img className='pop' src="/images/pop.png" alt="" />
      </div>
    </div>
  )
}

export default Home
