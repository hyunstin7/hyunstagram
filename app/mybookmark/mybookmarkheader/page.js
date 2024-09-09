'use client'
export default function MyBookmarkHeader ({user,ReceiveOpenBookmark }) {
    return(
        <div style={{width : '100%', padding: '10px 20px', position:'relative'}}>
            <p onClick={()=>{ReceiveOpenBookmark(false)}}> X </p>
            <h4 style={{ position: 'absolute',top:'50%', left: '50%', transform: 'translate3d(-50%,-50%,0)'}}>내 컬렉션</h4>
        </div>
    )
}