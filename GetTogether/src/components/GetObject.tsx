import React, { useState } from 'react';
import { S3Client, PutObjectCommand ,GetObjectCommand} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Video from './video';
import { FileUploader } from 'react-drag-drop-files';

const Geturl: React.FC = () => {
  const [objectUrl, setUrl] = useState<any>('');
  const [displayUrl,setDisplay] =useState<any>("");
  const fileTypes = ["JPG", "PNG", "mp4"];
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string>('');

  const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
      accessKeyId:'AKIAXMDS5S724F3EOBUQ',
      secretAccessKey:'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'
    },
  });
  async function getObjectURL(key:string){
    const command = new GetObjectCommand({
        Bucket:'wacthalong',
        Key:`${key}`
    })
    const url =await getSignedUrl(s3Client,command);
    setDisplay(url);
    console.log(url);
    return(url);
}
console.log(getObjectURL('v1.mp4'));
  return (
    <div>
      <Video url={displayUrl} />
    </div>
  );
};

export default Geturl;
