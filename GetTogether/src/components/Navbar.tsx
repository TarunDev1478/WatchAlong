import {useEffect,useState} from 'react'
import "../assets/navbar.css"
import PersonIcon from '@mui/icons-material/Person';

function Navbar() {
  const [token,setToken]=useState(localStorage.getItem('token'));
  const [username,setUsername]=useState();
  useEffect(() => {
    const get_username = async ()=>{
    const response = await  fetch('http://localhost:3000/auth/getme',{
      method:'GET',
      headers:{Authorization:`${token}`}
    });
    const data= await response.json();
    setUsername(data.username);
    console.log(data.username);
    };
    get_username();
  },[]);
  const logout = ()=>{
    localStorage.removeItem('token');
    setToken(null);
  }
  return (
    <div>
      <div className="nav">
        <img src="/images/logo12.png" alt="" />
        <li>
            <a style={{display:token?'none':''}} href="/login">Login</a>
            <a style={{display:token?'none':''}} href="/signup">Signup</a>
            <a style={{display:token?'':'none'}} onClick={logout}>Logout</a>
            <a href="">Help</a>
            <a style={{display:token?'':'none'}}> <PersonIcon sx={{ color: 'white',marginRight:'5px' }}/> {username}</a>
        </li>
      </div>
    </div>
  )
}

export default Navbar
