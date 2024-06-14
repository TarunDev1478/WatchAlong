import {useState} from 'react'
import { useNavigate } from 'react-router-dom';


function VideoCalling() {
    const navigate = useNavigate();
    const [roomCode,setRoomcode]= useState<any>();
    const handleFormsubmit =(e:any)=>{
        e.preventDefault();
        navigate(`/room/${roomCode}`);
    }
  return (
    <div className='home-page '>
      <form className='form'>
        <div>
            <label>Enter Room code</label>
            <input type="text" onChange={e=>setRoomcode(e.target.value)} placeholder='Enter room code' />
            <button onClick={handleFormsubmit}>submit</button>
        </div>
      </form>
    </div>
  )
}

export default VideoCalling
