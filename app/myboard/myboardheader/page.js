'use client'

export default function MyBoardHeader ({user,ReceiveOpenBorad }) {
    return(
        <div style={{width : '100%', padding: '10px 20px', position:'relative'}}>
            <p onClick={()=>{ReceiveOpenBorad(false)}}> X </p>
            <h4 style={{ position: 'absolute',top:'50%', left: '50%', transform: 'translate3d(-50%,-50%,0)'}}>{user.name}의 게시물</h4>
        </div>
    )
}