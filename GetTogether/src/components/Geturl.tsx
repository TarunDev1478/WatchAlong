import React, { useState } from 'react';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Video from './video';
import { FileUploader } from 'react-drag-drop-files';
import '../assets/geturl.css'
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import CheckIcon from '@mui/icons-material/Check';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import { ConsoleLevel } from '@zegocloud/zego-uikit-prebuilt';
const Geturl: React.FC = () => {
  const navigate =useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);
  
  const [objectUrl, setUrl] = useState<any>('');
  const [url,getUrl]=useState<String>();
  const fileTypes = ["mp4"];
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>('');
  const [room,setRoom]=useState(false);
  const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
      accessKeyId: 'AKIAXMDS5S724F3EOBUQ',
      secretAccessKey: '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'
    },
  });
  const updateVideoLink = async (url:String) => {
    getUrl(url);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/auth/update', {
        method: 'POST',
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
  
      if (response.ok) {
        console.log('Video link updated successfully');
      } else {
        console.log('Failed to update video link');
      }
    } catch (error) {
      console.error('Error updating video link:', error);
    }
  };
  const nextButton = ()=>{
    setRoom(true);
  }
  const putObject = async (file: File) => {
    if (!file) return;
    const command = new PutObjectCommand({
      Bucket: 'wacthalong',
      Key: `uploads/user-uploads/${file.name}`,
      Body: file,
      ContentType: file.type,
    });
    setFilename(file.name);
    const url = await getSignedUrl(s3Client, command);
    return url;
  };



  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    const uploadUrl = await putObject(uploadedFile);
    setUrl(uploadUrl);
  };
  const [roomCode,setRoomcode]= useState<any>();
  const handleFormsubmit = async (e: any) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:3000/auth/addroom', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Authorization': `${token}` },
            body: JSON.stringify({ roomid: roomCode, url: url })
        });
        console.log(response);
        if (response.ok) {
            console.log("Room added successfully");
            navigate(`/room/${roomCode}`);
        } else {
            console.log('Failed to add room');
        }
    } catch (error) {
        console.error('Error adding room:', error);
    }
}
  const uploadToS3 = async () => {
    setSuccess(false);
    setLoading(true);
    if (!file || !objectUrl) return;

    try {
      const response = await fetch(objectUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });
      if (response.ok) {
        setSuccess(true);
        setLoading(false);
        console.log('File uploaded successfully');
        console.log(getObjectURL(filename));
      } else {
        console.error('Error uploading file:', response.statusText);

      }
    } catch (error) {
      console.error('Error uploading file:', error);

    }
  };
  async function getObjectURL(key: string) {
    const command = new GetObjectCommand({
      Bucket: 'wacthalong',
      Key: `uploads/user-uploads/${key}`
    })
    const url = await getSignedUrl(s3Client, command);
    updateVideoLink(url);
    return (url);
  }
  return (
    <div>
      <div className="upload">
        <div className="triangle1"></div>
        <div className="st1"></div>
        <div className="st2"></div>
        <div className="triangle2"></div>
        <div className="function">
          <div className="why">
            <h1 style={{display: room==false?'':'none'}}>UpLoAd</h1>
            <h1 style={{display: room==true?'':'none'}}>RoOm</h1>
            <p style={{display: room==false?'':'none'}}>Upload movies You want to watch with your friend</p>
            <p style={{display: room==true?'':'none'}}>Enter room id you want you want to host.</p>
          </div>
          <div className="white">
            <div className="uploading" style={{display: room==false?'':'none'}}>
              <FileUploader handleChange={handleFileUpload} name="file" types={fileTypes} />
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Fab
                    aria-label="save"
                    color="primary"
                    sx={buttonSx}
                    onClick={uploadToS3}
                  >
                    {success ? <CheckIcon /> : <SaveIcon />}
                  </Fab>
                  {loading && (
                    <CircularProgress
                      size={68}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: -6,
                        left: -6,
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ m: 1, position: 'relative' }}>
                  <Button
                    variant="contained"
                    sx={buttonSx}
                    disabled={loading}
                    onClick={uploadToS3}
                  >
                    Upload
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: green[500],
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        marginTop: '-12px',
                        marginLeft: '-12px',
                      }}
                    />
                  )}
                </Box>
                <button onClick={nextButton} style={{backgroundColor:'#4caf50', color:'white', display: success==true?'':'none'}}>Next</button>
              </Box>
            </div>
            <div className="room" style={{display: room==true?'':'none'}}>
           <h1>Enter Room code</h1>
            <input type="text" onChange={e=>setRoomcode(e.target.value)} placeholder='Enter room code'/>
            <button onClick={handleFormsubmit}>JOIN</button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Geturl;
