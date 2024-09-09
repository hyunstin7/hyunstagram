'use client'

import LogOutBtn from "@/app/Logoutbtn"

export default function Menu({receiveOpenMenu}){
    return(
        <div className="move-rl" style={{position:'fixed',top:0,left:0,zIndex:999999, width:'100%',height:'100vh',background:'#000'}}>
        <div style={{ padding: '10px 20px', position: 'relative', width: '100%', display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/back.png"  style={{width : '25px'}}
                    onClick={() => { receiveOpenMenu(false) }}
                ></img>
                <h4 style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>설정</h4>
            </div>
        <div style={{display:'flex',flexDirection:'column',justifyContent:'flex-end',alignItems:'center'}}>
        
        <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',borderBottom:'1px solid #626262'}}>
            <LogOutBtn/>
        </div>
        </div>
        </div>
    )
}