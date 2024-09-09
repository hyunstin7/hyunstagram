'use client'

import { useEffect, useState } from "react"

export default function SubCommentList({ b, i, subdate, session, AddCommentName, OpenAddInput, OpenMainInput, OpenSubInput }) {

    const [writer,setWriter] = useState(null)
    const getInfo = async () => {
        const res = await fetch('/api/userinfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: b.author })
        })
        if (res.ok) {
            const writer = await res.json()
            setWriter(writer)
        }
    }
    useEffect(()=>{
        getInfo()
        setLikearr(b.likes)
    },[])

    let [likebtn, setLikebtn] = useState()
    let [likearr, setLikearr] = useState([])
    
    let LikeUp = () => {
        let arr = [...likearr]
        if (arr.indexOf(session.user.email) == -1) {
            arr.unshift(session.user.email)
        }
        setLikearr(arr)
        fetch('api/subcomment/likes/' + b._id, {
            method: 'POST',
            body: JSON.stringify(arr)
        })
        setLikebtn(false)
    }

    let LikeDown = () => {
        let arr = [...likearr]
        arr = arr.filter((e) => e !== session.user.email)
        setLikearr(arr)
        fetch('api/subcomment/unlike/' + b._id, {
            method: 'DELETE',
            body: JSON.stringify(arr)
        })
        setLikebtn(false)
    }

    return (
        <div style={{ display: 'flex', justifyContent : 'space-between' }}>
           
            {
                writer && 
                <div style={{ display : 'flex', width:'100%',marginTop:'5px'}}> 
            <div className="comment-profile2"> <img src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + writer.image} width={'28px'} height={'28px'} /></div>
            <div className="comment-content2" style={{ display: 'flex', flexDirection: 'column', marginLeft: '5px' }}>
                <h4 style={{ fontSize: '15px' }}>{writer.name}<span style={{ fontWeight: 'normal', fontSize: '12px', color: 'gray', marginLeft: '7px' }}>{subdate[i]}</span></h4>
                <p style={{ color: '#fff', margin: 0, lineHeight: '0.95', wordBreak: 'break-word',marginBottom:'5px'}}>{b.comment}</p>
                <p style={{ color: 'gray', fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                    AddCommentName(`@${writer.name} `)
                    OpenMainInput(false)
                    OpenSubInput(false)
                    OpenAddInput(true)
                }}>답글달기</p>
            </div>
            </div>
            }
            <div className="like" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' , height : 'max-content'}}>
                {
                    likebtn ?
                        session ? likearr.indexOf(session.user.email) !== -1 ?
                            <img width={'18px'} height={'18px'} src="/img/like.png" onClick={() => {
                                LikeDown()
                            }}></img>
                            :
                            <img width={'18px'} height={'18px'} src="/img/unlike.png" onClick={async () => {
                                LikeUp()
                            }}></img>

                            : <img width={'18px'} height={'18px'} src="/img/unlike.png" onClick={() => {
                                alert('로그인부터 쳐해라 뒤지기싫으면')
                            }}></img> :
                        session ? likearr.indexOf(session.user.email) !== -1 ?
                            <img width={'18px'} height={'18px'} src="/img/like.png" onClick={() => {
                                LikeDown()
                            }}></img>
                            :
                            <img width={'18px'} height={'18px'} src="/img/unlike.png" onClick={async () => {
                                LikeUp()
                            }}></img>

                            : <img width={'18px'} height={'18px'} src="/img/unlike.png" onClick={() => {
                                alert('로그인부터 쳐해라 뒤지기싫으면')
                            }}></img>

                }
                {
                    likearr.length !== 0 ? <p style={{ color: '#fff', fontSize: '12px' }}>{likearr.length}</p> : <p style={{ color: '#fff', fontSize: '12px', opacity: 0 }}>{likearr.length}</p>
                }

            </div>
        </div>
    )
}