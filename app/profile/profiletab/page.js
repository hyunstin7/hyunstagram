'use client'

import MyBoard from "@/app/myboard/page"
import MyBookmark from "@/app/mybookmark/page"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ProfileTab({user,session}){

    const [board,setBoard] = useState([])
    const [bookmark,setBookmark] = useState([])
    const [tabNum,setTabNum] = useState(0)
    const [openBoard,setOpenBoard] = useState(false)
    const [openBookmark,setOpenBookmark] = useState(false)

    const ReceiveOpenBorad = (e) => {
        setOpenBoard(e)
    }

    const ReceiveOpenBookmark = (e) => {
        setOpenBookmark(e)
    }

    const MountHandler = async() => {
        const res = await fetch('/api/myboard',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({email : user.email})
        })
        const board = await res.json()
        if(res.ok){
            setBoard(board)
        }
        const res2 = await fetch('/api/bookmark/list',{
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({email : user.email})
        })
        const bookmark = await res2.json()
        if(res2.ok){
            setBookmark(bookmark)
        }
    }

    const TabCilckHandler = (e) => {
        const AllTab =  document.querySelectorAll('.profile-tab')
                    AllTab.forEach((a)=>{
                        a.classList.remove('opa')
                    })
                    e.currentTarget.classList.add('opa')
    }

    useEffect(()=>{
        MountHandler()
    },[])

  
    return(
        <div style={{width : '100%', display:'flex', flexDirection:'column'}}>
            {openBoard && < MyBoard board={board} user={user} ReceiveOpenBorad={ReceiveOpenBorad}/>}
            {openBookmark && < MyBookmark bookmark={bookmark} user={user} ReceiveOpenBookmark={ReceiveOpenBookmark}/>}
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', position:'relative'}}>
                
                <div className="profile-tab0 profile-tab opa" style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', margin: '15px 0', opacity : 0.4, transition: 'opacity .3s'}}
                onClick={(e)=>{setTabNum(0);
                    TabCilckHandler(e) 
                }}
                >
                    <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/board.png" style={{width :'25px'}}/>
                </div>
                <div className="profile-tab1 profile-tab" style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', margin: '15px 0', opacity : 0.4, transition: 'opacity .3s'}}
                onClick={(e)=>{setTabNum(1);
                    TabCilckHandler(e)
                }}
                >
                    <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/reels.png" style={{width :'25px'}}/>
                </div>
                <div className="profile-tab2 profile-tab" style={{display:'flex', justifyContent:'center', alignItems:'center', width:'100%', margin: '15px 0', opacity : 0.4, transition: 'opacity .3s'}}
                onClick={(e)=>{setTabNum(2);
                    TabCilckHandler(e)
                }}
                >
                    <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/save-instagram.png" style={{width :'25px'}}/>
                </div>
                <p style={{position:'absolute', width:'33.3%', height:'2px', background:'#fff', bottom:0, left:`${tabNum*33.3}%`, transition: '.3s ease-out'}}></p>
            </div>
            <div style={{width : '100%', position:'relative', overflow: 'hidden'}}>
            <div style={{display:'flex', width:'300%', transform:`translate3d(-${100*tabNum}vw,0,0)`, transition:'transform .2s ease-out'}}>
            <div style={{display:'flex', flexWrap:'wrap', width:'100%'}}>
                {
                    board.slice().reverse().map((a,i)=>
                    <div key={i} style={{width : '33%',height:'33vw',margin: `0.5vw ${i % 3 - 1 == 0 ? 0.5 : 0}vw`,overflow:'hidden',position:'relative'}}
                    onClick={()=>{setOpenBoard(true)}}
                    >
                        <img src={"https://hyunstagram.s3.ap-northeast-2.amazonaws.com/" + a.images[0]} style={{
                            width:'100%',
                            top:`${a.pos[0]*window.innerWidth*0.33/(window.innerWidth-80)}px`,
                            transform:'translate3d(0,-50%,0)',
                            left:0,
                            position:'absolute'
                            }}/>
                    </div>
                    )
                }
                {
                    board.length == 0 &&
                    <div style={{textAlign:'center', width:'100%'}}>
                                <h4 style={{ margin: '100px 0 20px 0', fontSize: '15px' }}>당신의 게시물을 친구들에게 공유해보세요</h4>
                                <Link href='/writewrap' style={{ color: '#0b6ceb', cursor: 'pointer', fontSize: '12px' }}>첫 게시물 만들기</Link>
                    </div> 
                }
            </div>
            <div style={{width:'100%',textAlign:'center'}}>
                        {
                            session ? session.user.email == user.email ?
                            <div>
                                <h4 style={{ margin: '100px 0 30px 0', fontSize: '22px' }}>전 세계에 여러분의<br></br>순간을 공유해보세요</h4>
                                <p style={{ color: '#0b6ceb', cursor: 'pointer', fontSize: '15px' }}>첫 릴스 만들기</p>
                            </div> : <h4 style={{ margin: '100px 0 30px 0', fontSize: '22px' }}>현재 등록된 릴스가 없습니다</h4> : 
                            <h4 style={{ margin: '100px 0 30px 0', fontSize: '22px' }}>현재 등록된 릴스가 없습니다</h4>
                        }
            </div>
            <div style={{display:'flex', flexWrap:'wrap', width:'100%'}}>
                {
                        session ? session.user.email == user.email ? bookmark.slice().reverse().map((a,i)=>
                        <div key={i} style={{width : '33%',height:'33vw',margin: `0.5vw ${i % 3 - 1 == 0 ? 0.5 : 0}vw`,overflow:'hidden',position:'relative'}}
                        onClick={()=>{setOpenBookmark(true)}}
                        >
                            <img src={"https://hyunstagram.s3.ap-northeast-2.amazonaws.com/" + a.images[0]} style={{width:'100%',
                            top:`${a.pos[0]*window.innerWidth*0.33/(window.innerWidth-80)}px`,
                            transform:'translate3d(0,-50%,0)',
                            left:0,
                            position:'absolute'}}/>
                        </div>)
                        : <h4 style={{margin:'100px auto',textAlign:'center'}}>사용자 본인만 볼 수 있는 페이지입니다</h4> :
                        <h4 style={{margin:'100px auto',textAlign:'center'}}>사용자 본인만 볼 수 있는 페이지입니다</h4>
                }
                {
                    session && session.user.email == user.email && bookmark.length == 0 && <h4 style={{margin:'100px auto',textAlign:'center'}}>현재 저장된 게시물이 없습니다</h4>
                }
            </div>
            </div>
            </div>
            

        </div>
    )
}