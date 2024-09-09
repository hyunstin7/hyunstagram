'use client'

import { useEffect, useState } from "react"
import Menu from "../menu/page"



export default function ProfileHeader({user,session}) {
    const [openMenu, setOpenMenu] = useState(false)
    const [userInfo,setUserInfo] = useState(user)
    const receiveOpenMenu = (e) => {
        setOpenMenu(e)
    }


    return(
        <div className="profile-header" style={{display : 'flex', width: '100%', padding : '20px', justifyContent : 'space-between', alignItems : 'center'}}>
            {session && <p style={{fontSize:'18px',fontWeight:'bold'}}>{userInfo.name}</p>}
                
                {
                    session && session.user.email == userInfo.email && <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/more.png" style={{width:'25px'}}
                    onClick={()=>{setOpenMenu(true)}}/>
                }
                {
                    openMenu && <Menu receiveOpenMenu={receiveOpenMenu}/>
                }
                
            </div>
    )
}