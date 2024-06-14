import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Video from '../components/video';
import { FileUploader } from 'react-drag-drop-files';
import { ZegoExpressEngine } from 'zego-express-engine-webrtc'
import '../assets/room.css'

function Room1() {
    const [displayUrl, setDisplay] = useState<any>("");
    const fileTypes = ["JPG", "PNG", "mp4"];
    const [file, setFile] = useState<File | null>(null);
    const [filename, setFilename] = useState<string>('');
    const { roomid } = useParams();
    const token= localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(()=>{
        const get_url = async()=>{
            const response = await fetch('http://localhost:3000/auth/geturl',{
                method:'GET',
                headers:{Authorization:`${token}`}
            })
            const data= await response.json();
            setDisplay(data.videolink);
            console.log(displayUrl);
        }
        get_url();
    },[]);
    const meeting = async (element: any) => {
        const appId = 603338277;
        const serverSecret = '6bffafc3e43c5fc581d46325acf46c4e';
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, roomid?.toString() ?? '', Date.now().toString(), "Tarun");
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.VideoConference,
            },
        });
    };
    const closeRoom = async()  =>{
        const token=localStorage.getItem('token');
        const response = fetch('http://localhost:3000/auth/closeroom',{
            method:'POST',
            headers:{Authorization:`${token}`}
        })
        if((await response).ok){
            console.log("Room closed succesfully");
            navigate('/');
        }
        else{
            console.log(response);
            console.log('server Erorr');
        }
    }
    return (
        <div>
            <div className="main4">
            <div className="video">
                <h1 style={{marginBottom:"20px"}}>Watch and enjoy</h1>
                <Video url={displayUrl} />
                <button onClick={closeRoom} style={{marginLeft:'340px',marginTop:'40px'}}>Close room</button>
            </div>
            <div className="line">
                
            </div>
            <div style={{position:"fixed",top:'100px'}} className='room-page' >
                <div ref={meeting}></div>
            </div>
            </div>
        </div>
    );
}

export default Room1;
