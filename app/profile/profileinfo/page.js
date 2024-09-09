'use client'

import { useEffect, useState } from "react"
import FollowTab from "../followtab/page"


export default function ProfileInfo({user : initialData,session}){

    const [userInfo,setUserInfo] = useState(initialData)
   
    const [board,setBoard] = useState([])
    const [openFollowTab,setOpenFollowTab] = useState(false)
    const [tab,setTab] = useState(0)
    const receiveOpenFollowTab = (e) => {
        setOpenFollowTab(e)
    }
 

    const  MountHandler = async () =>{
            const res = await fetch('/api/myboard',{
                method : 'POST',
                headers : {'Content-Type' : 'application/json'},
                body : JSON.stringify({email : userInfo.email})
            })
            const board = await res.json()
            if(res.ok){
                await setBoard(board)
            }
    }
    
    useEffect(()=>{
        
    MountHandler()

  
      
    },[])

   
    return(
        <div style={{marginBottom :'10px'}}>
            {
                openFollowTab && <FollowTab userInfo={userInfo} receiveOpenFollowTab={receiveOpenFollowTab} tab={tab}/>
            }
        <div style={{ display : 'flex', justifyContent : 'space-between', alignItems : 'center', width : '100%', padding : '10px 20px'}}>
            <div style={{ width : '80px', height : '80px', position :'relative'}}>
            <div style={{ width : '80px', height : '80px', position :'relative',borderRadius : '50%',overflow:'hidden'}}>
                <img src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + userInfo.image} style={{ width : '80px',position:'absolute',top:'50%',left:0,transform:'translate3d(0,-50%,0)'}}/>
                
            </div>
            <img src='https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/plus.png' style={{ width : '25px', position : 'absolute', bottom : 0, right : 0}}/>
            </div>
            <div style={{ display : 'flex', justifyContent : 'space-between', alignItems : 'center', width : 'calc(100% - 80px)', padding : '0 30px'}}>
                <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column'}}>
                    <span>{board.length}</span>
                    <p style={{fontSize:'13px'}}>게시물</p>
                </div>
                <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column'}}
                onClick={()=>{setTab(0); setOpenFollowTab(true)}}
                >
                    <span>{userInfo.follower.length}</span>
                    <p style={{fontSize:'13px'}}>팔로워</p>
                </div>
                <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column'}}
                onClick={()=>{setTab(1); setOpenFollowTab(true)}}
                >
                    <span>{userInfo.following.length}</span>
                    <p style={{fontSize:'13px'}}>팔로잉</p>
                </div>
            </div>
        </div>
        </div>
    )
}