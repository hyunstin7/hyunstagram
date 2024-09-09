'use client'

import { useState } from "react"


export default function EditImg({ ReceiveOpenEditName, ReceiveName, currentName, userInfo}) {
    const [saveName, setSaveName] = useState('')
    const [error, setError] = useState('')

    const HandleUpload = async () => {
        if(saveName.length<5){
            setError('최소 다섯글자 적어주셔야합니다')
        }else{
            const res = await fetch('/api/profile/name', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: saveName, email : userInfo.email })
            })
            const result = await res.json()
            if (res.ok) {
                ReceiveOpenEditName(false);
                ReceiveName(saveName)
            } else {
                setError(result.message)
            }
        }
        
    }


    return (
        <div className="move-rl" style={{ position: 'fixed', width: '100%', height: '100vh', background: '#000', top: 0, left: 0, zIndex: 888888 }}>
            <div style={{ padding: '10px 20px', position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/back.png" style={{ width: '25px' }}
                    onClick={() => { ReceiveOpenEditName(false); ReceiveName(currentName) }}
                ></img>
                <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>이름 변경</p>

            </div>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',marginTop:'100px' }}>
                <p style={{marginBottom:'20px'}}>변경 할 이름을 적어주세요</p>
                <input  type="text" maxLength={15} value={saveName.toLowerCase()}  placeholder="사용자 이름" onChange={(e) => { 
                    setSaveName(e.currentTarget.value) 
                    if(e.currentTarget.value=='') {
                      document.querySelector('.save-name-btn').classList.remove('changebutton')
                      }else{
                        if(!/^[a-z0-9_.]+$/.test(e.currentTarget.value)){
                          setError('특수문자는 사용 할 수 없습니다')
                          document.querySelector('.save-name-btn').classList.remove('changebutton')
                        }else{
                          setError('')
                          document.querySelector('.save-name-btn').classList.add('changebutton')
                        }
                      }
                    }}></input>
                <p>{error}</p>
                <button className="save-name-btn" onClick={() => {
                    HandleUpload();
                }} style={{ color: '#000', padding:'10px 20px', background : '#dedede', marginTop:'20px', position:'none' }}>완료</button>
            </div>

        </div>
    )
}