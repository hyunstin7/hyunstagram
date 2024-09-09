'use client'

import { useEffect, useState } from "react"
import EditProfile from "../editprofile/page"

export default function ProfileSetting({user,session}){
    const [userInfo,setUserInfo] = useState(user)
    const [followBtn,setFollowBtn] = useState(true)
    const [ following , setFollowing] = useState(null)
    const [sessionUser, setSessionUser] = useState(null)
    const [openshare, setOpenShare] = useState(false)
    const [openEditProfile , setOpenEditProfile] = useState(false)
    const [realName,setRealName] = useState(user.realName)
    const [intro,setIntro] = useState(user.intro.content)
    const HandleFollow = async () => {
        const res = await fetch('/api/following', {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({ followingEmail : session.user.email , followerEmail : userInfo.email})
        })
        await setFollowBtn(false)
    }

    const HandleFollowCancel = async () => {
        const res = await fetch('/api/following', {
            method : 'DELETE',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({ followingEmail : session.user.email , followerEmail : userInfo.email})
        })
        await setFollowBtn(true)
    }

    const MountHandler = async () => {
        
        const res = await fetch('/api/userinfo', {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({ email : session.user.email})
        })
        const result = await res.json()
        if(result.following.includes(userInfo.email)){
            setFollowBtn(false)
        }
        await setSessionUser(result)
        await setFollowing(result.following)
    }

    const copyToClipboard = async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          alert('주소가 복사되었습니다!') 
        } catch (err) {
          alert('에러 발생');
        }
      };

     const receiveOpenEditProfile = (e) => {
        setOpenEditProfile(e)
     }

      const sharePage = async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: document.title,
              url: window.location.href,
            });
          } catch (err) {
            alert('에러발생. 공유실패 errorcode :',err);
          }
        } else {
            alert('공유를 지원하지않는 기기입니다.');
        }
      };
      

      const ReceiveRealName = (e) => {
        setRealName(e)
      }
      const ReceiveIntro = (e) => {
        setIntro(e)
      }

      useEffect(()=>{
        MountHandler()
        
    },[])

    
    return(
        <div >
            <h4 style={{margin :'0 20px'}}>{realName}</h4>
            <p style={{margin :'0 20px',whiteSpace:'pre-wrap', overflowWrap:'break-word'}}>{intro}</p>
            {
                openshare && 
                <div className="share-wrap" onClick={()=>{setOpenShare(false)}} style={{ display : 'flex', justifyContent: 'center', alignItems : 'center', position: 'fixed', width : '100vw', height : '100vh',top : 0, left : 0, zIndex : 999999, background :'#00000071'}}>
                <div className="share-box move-bt2" onClick={(e)=>{e.stopPropagation()}}
                style={{ 
                    borderRadius : '10px', 
                    overflow : 'hidden', 
                    display : 'flex', 
                    position : 'absolute', 
                    bottom : '50px', 
                    width : '100%', 
                    justifyContent : 'center',
                    alignItems : 'center', 
                    borderRadius : '20px 20px 0 0', 
                    background : '#1b1b1b',
                    padding : '10px 0'}}>
                    <div style={{ display: 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column'}}
                    onClick={()=>{
                        sharePage()
                    }}>
                    <div className="img-wrapper" style={{width: '40px', height : '40px', margin : '0 5px 5px 5px', display : 'flex', justifyContent : 'center', alignItems : 'center', padding: '5px', background : '#383838', borderRadius : '50%'}}>
                        <img style={{width : '20px'}} src="/img/share2.png"></img>
                    </div>
                    <p style={{ color : '#fff', fontSize : '10px'}}>공유하기</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column'}}
                    onClick={()=>{
                        copyToClipboard()
                    }}>
                    <div className="img-wrapper" style={{  width: '40px', height : '40px', margin : '0 5px 5px 5px', display : 'flex', justifyContent : 'center', alignItems : 'center', padding: '5px', background : '#383838', borderRadius : '50%'}}>
                        <img style={{width : '20px'}} src="/img/link.png"></img>
                    </div>
                    <p style={{ color : '#fff', fontSize : '10px'}}>링크복사</p>
                    </div>
                </div>
            </div>
            }
            {
                openEditProfile && <EditProfile
                 userInfo={userInfo} 
                 receiveOpenEditProfile={receiveOpenEditProfile} 
                 ReceiveIntro={ReceiveIntro} 
                 ReceiveRealName={ReceiveRealName}
                 realName={realName}
                 intro={intro}
                 />
            }
            {
                session ? session.user.email == userInfo.email ?
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'0 30px', margin:'30px 0'}}>
                        <button style={{ width: '48%', background: '#373737', borderRadius: '7px', padding : '10px 0'}}
                        onClick={()=>{setOpenEditProfile(true)}}
                        >프로필 편집</button>
                        <button onClick={()=>{setOpenShare(true)}} style={{ width: '48%', background: '#373737', borderRadius: '7px', padding : '10px 0'}}>프로필 공유</button>
                    </div> :
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'0 30px', marginBottom:'30px'}}>
                        {
                            followBtn ?
                        <button onClick={()=>{HandleFollow()}} style={{ width: '48%', background: '#295ce9', borderRadius: '7px', padding : '10px 0'}}>팔로우</button>
                        : <button onClick={()=>{HandleFollowCancel()}} style={{ width: '48%', background: '#295ce9', borderRadius: '7px', padding : '10px 0'}}>팔로우 취소</button>
                        }
                        <button onClick={()=>{alert('아직 미구현 상태입니다')}}style={{ width: '48%', background: '#373737', borderRadius: '7px', padding : '10px 0'}}>메세지</button>
                    </div> :
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', width:'100%', padding:'0 30px', marginBottom:'30px'}}>
                        <button onClick={()=>{alert('로그인부터 하세요')}} style={{ width: '48%', background: '#295ce9', borderRadius: '7px', padding : '10px 0'}}>팔로우</button> 
                        <button onClick={()=>{alert('로그인부터 하세요')}} style={{ width: '48%', background: '#373737', borderRadius: '7px', padding : '10px 0'}}>메세지</button>
                    </div>
            }
            
            
        </div>
    )
}