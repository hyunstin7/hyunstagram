'use client'

import { useCallback, useEffect, useState } from "react"
import EditImg from "./editimg/page"
import EditName from "./editname/page"

export default function EditProfile({userInfo,receiveOpenEditProfile,ReceiveRealName,ReceiveIntro,realName,intro}){
    const [image,setImage] = useState("https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/" + userInfo.image)
    const [currentImage,setCurrentImage] = useState("https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/" + userInfo.image)
    const [name,setName] = useState(userInfo.name)
    const [currentName,setCurrentName] = useState(userInfo.name)
    const [openEditImg,setOpenEditImg] = useState(false)
    const [openEditName,setOpenEditName] = useState(false)
    const [selectedFile,setSelectedFile] = useState({})
    const [textAreaHeight,setTextAreaHeight] = useState(userInfo.intro.height)
    const [pos,setPos] = useState(0)


    const ReceivePos = (e) =>{
        setPos(e)
    }

    const ReceiveOpenEditImg = (e) =>{
        setOpenEditImg(e)
    }

    const ReceiveOpenEditName = (e) =>{
        setOpenEditName(e)
    }
    const ReceiveImage = (e) => {
        setImage(e)
    }
    const ReceiveName = (e) => {
        setName(e)
    }

    const handleFileChange = useCallback((e) => {
        const newFile = e.target.files[0]
            newFile.preview = URL.createObjectURL(newFile);  // 미리보기 URL 생성
        setSelectedFile(newFile);  // 파일 상태 업데이트
        setOpenEditImg(true)
        },[]);

    

    const HandleContentSave = async() => {
        const res = await fetch('/api/profile/content',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({realName, intro, height : textAreaHeight, email : userInfo.email})
        })
      }

    return(
        <div className="move-rl" style={{width: '100%', height: '100vh', background: '#000', position: 'fixed', zIndex: 999999, top: 0, left: 0 }}>
            {openEditImg && <EditImg 
            selectedFile={selectedFile} 
            ReceivePos={ReceivePos}
            ReceiveOpenEditImg={ReceiveOpenEditImg}
            userInfo={userInfo}
            pos={pos}
            ReceiveImage={ReceiveImage}
            currentImage={currentImage}
            />}
            {openEditName && <EditName
            ReceiveOpenEditName={ReceiveOpenEditName}
            userInfo={userInfo}
            ReceiveName={ReceiveName}
            currentName={currentName}
            />}
            <div style={{ padding: '10px 20px', position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/back.png" style={{ width: '25px' }}
                    onClick={() => { receiveOpenEditProfile(false); HandleContentSave(); window.location.href = '/profile/' + name }}
                ></img>
                <h4 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>내 프로필</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '100px 30px' }}>
                <div style={{borderRadius: '50%', overflow: 'hidden',width:'80px',height:'80px'}}>
                <img src={image} style={{ width: '80px' }}></img>
                </div>
                <label className="custom-file-input">
                    <span style={{ width: 'max-content' }}>프로필 사진 수정</span>
                    <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                        className="select-img"
                        style={{ display: 'none' }}
                    />
                </label>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '50%', position: 'relative' }}>
                    <p style={{ position: 'absolute', top: '50%', left: '-45px', transform: 'translate3d(0,-50%,0)' }}>이름</p>
                    <input defaultValue={realName} type="text" placeholder="이름" style={{ width: '100%', background:'#000', color:'#fff' }} onChange={(e)=>{ReceiveRealName(e.currentTarget.value)}}></input>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '50%', position: 'relative' }}
                    onClick={() => { }}>
                    <p style={{ position: 'absolute', top: '50%', left: '-97px', transform: 'translate3d(0,-50%,0)' }}>사용자 이름</p>
                    <div onClick={(e) => { e.stopPropagation(); setOpenEditName(true) }} style={{ width: '100%', background:'#000', color:'#fff', border:'solid 1px #bebebe', padding:'10px', margin:'5px 0', borderRadius :'3px', fontSize:'13px' }}>{name}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '50%', position: 'relative' }}>
                    <p style={{ position: 'absolute', top: '13px', left: '-45px', transform: 'translate3d(0,0,0)' }} >소개</p>
                    <textarea defaultValue={intro} type="text" placeholder="소개" maxLength={60} style={{ width: '100%', wordWrap: 'break-word', height:`${textAreaHeight}`, resize:"none", outline:'none', overflow:'hidden', margin:'5px 0', padding : '10px', boxSizing:'border-box' ,border:'solid 1px #bebebe', borderRadius :'3px'}}
                    onChange={(e)=>{
                        setTextAreaHeight(`${e.currentTarget.scrollHeight}px`)
                        ReceiveIntro(e.currentTarget.value)
                    }}></textarea>
                </div>
            </div>
        </div>
    )
}