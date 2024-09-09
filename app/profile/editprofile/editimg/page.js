'use client'

import { useEffect, useState } from "react"
import AWS from 'aws-sdk';

AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
    params: { Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME },
    region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export default function EditImg({selectedFile,pos,ReceivePos,ReceiveOpenEditImg,userInfo,ReceiveImage,currentImage}){

    let k = (window.innerWidth - 80) / 2
    k > 768 ? k = 768 : k = k
    let [startPosY, setStartPosY] = useState(0)
    let [draggingPosY, setDraggingPosY] = useState(0)
    let [endPosY, setEndPosY] = useState(k)
    const [value, setValue] = useState(0)


    useEffect(() => {
        let Copy = pos
        Copy = endPosY
        ReceivePos(Copy)
    }, [endPosY])
    let dsf;

    const getContentType = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'jpg':
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            default:
                return 'application/octet-stream'; // Default fallback for unsupported types
        }
    };

    const handleUpload = async () => {
        try {
            const uploadedFileKey = await Promise.all(
                [selectedFile].map(async (file) => {
                  const params = {
                    Body: file,
                    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
                    Key: `hyunstagram/${userInfo.name}/${file.name}`,
                    ContentType: getContentType(file.name),
                  };
              
                  // AWS SDK v3 사용 시
                  await s3.putObject(params).promise();
              
                  return `${userInfo.name}/${file.name}`; // Promise의 반환값
                })
              );
              

        
                    
             
            
            const response = await fetch('/api/profile/img', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: uploadedFileKey, email : userInfo.email }),
            });

            if (response.ok) {
                const res = await response.json();
                window.location.href = '/profile/' + userInfo.name
            } else {
                throw new Error('Failed to send URLs to API');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    const TouchStart = (e) => {
        setStartPosY(e.touches[0].clientY);
    }

    const TouchMove = (e) => {
       
            setDraggingPosY(e.touches[0].clientY - startPosY);
            e.target.style.top = `${e.touches[0].clientY - startPosY + endPosY}px`;
            setValue(e.touches[0].clientY - startPosY + endPosY)
    }

    const TouchEnd = (e) => {
        
        const range = e.target.clientHeight / 2 - k
        endPosY + draggingPosY >= k + range ? setEndPosY(k + range) :
            endPosY + draggingPosY <= k - range ? setEndPosY(k - range) : setEndPosY(endPosY + draggingPosY)
            endPosY + draggingPosY >= k + range ? setValue(k + range) :
            endPosY + draggingPosY <= k - range ? setValue(k - range) : setValue(endPosY + draggingPosY)
        e.target.style.top = `${endPosY}px`;
    }

   
    return(
        <div style={{position:'fixed',width:'100%',height:'100vh',background:'#000',top:0,left:0,zIndex:888888}}>
            <div style={{ padding: '10px 20px', position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/back.png" style={{ width: '25px' }}
                    onClick={() => { ReceiveOpenEditImg(false); ReceiveImage(currentImage)}}
                ></img>
                <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>내 프로필 사진</p>
                <h4 onClick={()=> { 
                        ReceiveOpenEditImg(false);
                        handleUpload();
                        ReceiveImage(selectedFile.preview)
                      }} style={{color:'#3973c9'}}>완료</h4>
            </div>
            <div className="img-wrap" style={{ width: 'calc(100vw - 80px)', maxWidth: '768px', maxHeight: '768px', height: 'calc(100vw - 80px)', margin: '20px 40px',position: 'absolute', overflow: 'hidden', background:'#000' }} >
            <img draggable="true" src={selectedFile.preview} alt={`Preview`} style={{ position: 'absolute', zIndex: 1, width: '100%', top: `${value}px`, transform: 'translate3d(0,-50%,0)',opacity:0.4 }}
                onTouchStart={TouchStart}
                onTouchMove={TouchMove}
                onTouchEnd={TouchEnd}

            />
            <div className="img-wrap" style={{ width: 'calc(100vw - 80px)', maxWidth: '768px', maxHeight: '768px', height: 'calc(100vw - 80px)', position: 'absolute', zIndex: 1, borderRadius:'50%', overflow: 'hidden', background:'#000' }} >
            <img draggable="true" src={selectedFile.preview} alt={`Preview`} style={{ position: 'absolute', width: '100%', top: `${endPosY}px`, transform: 'translate3d(0,-50%,0)'}}
                onTouchStart={TouchStart}
                onTouchMove={TouchMove}
                onTouchEnd={TouchEnd}

            />

            </div>
        </div>
        
        </div>
    )
}