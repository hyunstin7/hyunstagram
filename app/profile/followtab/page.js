'use client'

import { useEffect, useState } from "react"

export default function FollowTab({userInfo,receiveOpenFollowTab,tab}){

    const [tabNum, setTabNum] = useState(0)
    const [follower, setFollower] = useState(null)
    const [following, setFollowing] = useState(null)
    const [followerText,setFollowerText] = useState('')
    const [followerResult,setFollowerResult] = useState('')
    const [openFollowerResult , setOpenFollowerResult] = useState(false)
    const [followingText,setFollowingText] = useState('')
    const [followingResult,setFollowingResult] = useState('')
    const [openFollowingResult , setOpenFollowingResult] = useState(false)



    const highlightText = (text, query) => {
        if (!query) return text;
    
        // 대소문자 구분 없는 정규 표현식 생성
        const regex = new RegExp(`(${query})`, 'gi');
    
        // 검색어와 일치하는 부분을 강조하기 위해 HTML로 변환
        return text.replace(regex, '<span style="background-color: blue;">$1</span>');
    };

    const MountHandler = async () => {
        const res = await fetch('/api/follower/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ follower: userInfo.follower })
        })
        const followerList = await res.json()
        await setFollower(followerList)

        const res2 = await fetch('/api/following/list', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ following: userInfo.following })
        })
        const followingList = await res2.json()
        await setFollowing(followingList)
        await setTabNum(tab)
    }

    const TabCilckHandler = (e) => {
        const AllTab =  document.querySelectorAll('.follow-tab')
                    AllTab.forEach((a)=>{
                        a.classList.remove('opa')
                    })
                    e.currentTarget.classList.add('opa')
    }
    useEffect(() => {
        MountHandler()
    }, [])
    return(
        <div className="move-rl" style={{position:'fixed',zIndex:9999999,top:0,left:0,width:'100%',height:'100vh',background:'#000'}}>
            <div style={{padding : '10px 20px',position:'relative',width:'100%'}}>
            <p style={{position:'absolute',top:'50%',left:'20px',transform:'translate3d(0,-50%,0)'}}
            onClick={()=>{receiveOpenFollowTab(false)}}
            >X</p>
            <h4 style={{textAlign:'center'}}>{userInfo.name}</h4>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center', width:'100%'}}>
                <div className="follow-tab opa" style={{display:'flex',justifyContent:'center',alignItems:'center', padding:'10px 0', width:'100%', opacity:0.4}} onClick={(e)=>{
                    setTabNum(0)
                    TabCilckHandler(e)
                    setFollowingText('')    
                }}>
                    <p><span style={{marginRight:'3px'}}>{userInfo.follower.length == 0 ? null : userInfo.follower.length}</span>팔로워</p>
                </div>
                <div className="follow-tab" style={{display:'flex',justifyContent:'center',alignItems:'center', padding:'10px 0', width:'100%', opacity:0.4}} onClick={(e)=>{
                    setTabNum(1)
                    TabCilckHandler(e)
                    setFollowerText('')
                }}>
                    <p><span style={{marginRight:'3px'}}>{userInfo.following.length == 0 ? null : userInfo.following.length}</span>팔로잉</p>
                </div>
            </div>
            <div style={{ width: '100%', background: '#0000002a', height: '2px', position: 'relative' }}>
                <div style={{ width: '50%', background: '#fff', height: '100%', borderRadius: '2px', position: 'absolute', left: 0, top: 0, transform: `translate3d(${100 * tabNum}%,0,0)`, transition:'transform .2s ease-out' }}></div>
            </div>
            <div style={{display:'flex',width:'200%', transform: `translate3d(${-100 * tabNum}vw,0,0)`, transition:'transform .2s ease-out'}}>
            <div style={{width:'100%', display:'flex',alignItems:'center', flexDirection:'column'}}>
            <div style={{width:'calc(100% - 60px)', background:'#fff', display:'flex',alignItems:'center',borderRadius :'10px',overflow:'hidden', padding :'10px 20px', margin:'40px 0'}}>
            <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/search.png" alt="" style={{width:'20px',marginRight:'10px'}}/>
            <input className="search-input" type="search" placeholder="검색" name="current" value={followerText}
            onChange={(e)=>{
                setFollowerText(e.currentTarget.value);
                setOpenFollowerResult(true)
            }}
            
             style={{ width : '100%',border:'none', outline:'none', padding :'0', background:'#fff'}}/>
             </div>
                {
                    
                    openFollowerResult ? follower &&  follower.filter((e)=> e.name.includes(followerText)).map((a,i)=>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',padding:'10px 20px'}} key={i}>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <img style={{marginRight:'10px', width:'25px'}} src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + a.image}></img>
                                <span dangerouslySetInnerHTML={{ __html: highlightText(a.name, followerText) }}></span>
                            </div>
                            <img style={{ width:'25px'}} src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/option.png"
                            onClick={()=>{}}
                            ></img>
                        </div>) : follower &&  follower.map((a,i)=>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',padding:'10px 20px'}} key={i}>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <img style={{marginRight:'10px', width:'25px'}} src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + a.image}></img>
                                <span>{a.name}</span>
                            </div>
                            <img style={{ width:'25px'}} src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/option.png"
                            onClick={()=>{}}
                            ></img>
                        </div>)
                    
                }
            </div>
            
            <div style={{width:'100%', display:'flex',alignItems:'center', flexDirection:'column'}}>
            <div style={{width:'calc(100% - 60px)', background:'#fff', display:'flex',alignItems:'center',borderRadius :'10px',overflow:'hidden', padding :'10px 20px', margin:'40px 0'}}>
            <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/search.png" alt="" style={{width:'20px',marginRight:'10px'}}/>
            <input className="search-input" type="search" placeholder="검색" name="current" value={followingText}
            onChange={(e)=>{
                setFollowingText(e.currentTarget.value);
                setOpenFollowingResult(true)
            }}
            
             style={{ width : '100%',border:'none', outline:'none', padding :'0', background:'#fff'}}/>
             </div>
                {
                    
                    openFollowingResult ? following &&  following.filter((e)=> e.name.includes(followingText)).map((a,i)=>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',padding:'10px 20px'}} key={i}>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <img style={{marginRight:'10px', width:'25px'}} src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + a.image}></img>
                                <span dangerouslySetInnerHTML={{ __html: highlightText(a.name, followingText) }}></span>
                            </div>
                            <img style={{ width:'25px'}} src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/option.png"
                            onClick={()=>{}}
                            ></img>
                        </div>) : following &&  following.map((a,i)=>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',padding:'10px 20px'}} key={i}>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <img style={{marginRight:'10px', width:'25px'}} src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + a.image}></img>
                                <span>{a.name}</span>
                            </div>
                            <img style={{ width:'25px'}} src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/option.png"
                            onClick={()=>{}}
                            ></img>
                        </div>)
                    
                }
            </div>
            </div>
        </div>
    )
}