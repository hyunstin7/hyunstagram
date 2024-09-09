'use client'

import circulaterDate from "@/util/CirculateDate"
import { useEffect, useState } from "react"
import SubCommentList from "../subcommentlist/page";



export default function CommentList({ a, i, date, session, CloseComment, opencomment, SubCommentName, PushCommentId, subcommentlist1, OpenMainInput, OpenSubInput }) {

    let cirsubdate;
    let [subdate, setSubdate] = useState([])
    let [likebtn, setLikebtn] = useState()
    let [likearr, setLikearr] = useState([])
    let [opensubcomment, setOpensubcomment] = useState(false)
    let [subcomment, setSubcomment] = useState(false)
    let [closecomment, setClosecomment] = useState(false)
    let [subcommentlist, setSubCommentList] = useState([])
    let [addComment, setAddComment] = useState()
    let [addCommentBtn, setAddCommentBtn] = useState(false)
    let [openAddInput, setOpenAddInput] = useState(false)
    const [writer, setWriter] = useState(null)


    const AddCommentName = (e) => {
        setAddComment(e)
    }

    const OpenAddInput = (e) => {
        setOpenAddInput(e)
    }

    const getInfo = async () => {
        const res = await fetch('/api/userinfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: a.author })
        })
        if (res.ok) {
            const writer = await res.json()

            setWriter(writer)
        }
    }

    useEffect(() => {
        getInfo()
        fetch('/api/subcomment/list/' + a._id).then((r) => r.json()).then((e) => {
            setSubCommentList(e);
            cirsubdate = e.map((a, i) => {
                return circulaterDate(a)
            })
            setSubdate(cirsubdate)
        })

        setLikearr(a.likes)

        function handleClickOutside(event) {
            const modal = document.querySelector('.comment-modal');
            if (modal == event.target) {
                modal.classList.remove('comment-expand');
                setOpenAddInput(false)
                OpenMainInput(false)
                OpenSubInput(false)
                OpenAddInput(false)
            }
        }

        // 이벤트 리스너 추가
        window.addEventListener('click', handleClickOutside);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };

    }, [])


    useEffect(() => {
        fetch('/api/subcomment/list/' + a._id).then((r) => r.json()).then((e) => {
            setSubCommentList(e);
            cirsubdate = e.map((a, i) => {
                return circulaterDate(a)
            })
            setSubdate(cirsubdate)
        })
    }, [subcommentlist1])





    useEffect(() => {

        setOpensubcomment(opencomment)
        setSubcomment(false)
    }, [opencomment])


    let LikeUp = () => {
        let arr = [...likearr]
        if (arr.indexOf(session.user.email) == -1) {
            arr.unshift(session.user.email)
        }
        setLikearr(arr)
        fetch('api/comment/likes/' + a._id, {
            method: 'POST',
            body: JSON.stringify(arr)
        })
        setLikebtn(false)
    }

    let LikeDown = () => {
        let arr = [...likearr]
        arr = arr.filter((e) => e !== session.user.email)
        setLikearr(arr)
        fetch('api/comment/unlike/' + a._id, {
            method: 'DELETE',
            body: JSON.stringify(arr)
        })
        setLikebtn(false)
    }



    return (
        <div className="comment-list" style={{ padding: '15px 10px' }}>
            {
                openAddInput ? <div className="input-bg sub-input-bg">
                    <div className="input-comment" >
                        <input id="input1" onChange={(e) => { setAddComment(e.target.value); }} value={addComment}></input>
                        <button style={{ marginLeft: '5px', width: 'max-content', display: 'block' }} onClick={async () => {
                            await fetch('/api/subcomment/' + a._id,
                                {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ comment: addComment })
                                })
                                .then((r) => r.json())
                                .then((e) => {
                                    if (e == '') { alert('로그인 이후 이용 가능합니다.') } else {
                                        setSubCommentList(e);
                                        cirsubdate = e.map((a, i) => {
                                            return circulaterDate(a)
                                        })
                                        setSubdate(cirsubdate)
                                        setAddComment('')
                                        setOpenAddInput(false)
                                        OpenMainInput(true)
                                        OpenSubInput(false)
                                    }
                                })

                        }}><p style={{ width: 'max-content', borderRadius: '10px', color: '#fff', fontSize: '30px' }}>▲</p></button>
                    </div>
                </div> : null


            }
            <div className="comment" style={{ color: "#fff", display: 'flex', justifyContent: 'space-between' }}>
                {writer &&
                    <div style={{ display: 'flex' }}>
                        <div className="comment-profile" style={{marginTop:'1px'}}> <img src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + writer.image} width={'32px'} height={'32px'} /></div>
                        <div className="comment-content" style={{ display: 'flex', flexDirection: 'column', marginLeft: '5px' }}>
                            <h4 style={{ fontSize: '15px' }}>{writer.name}<span style={{ fontWeight: 'normal', fontSize: '12px', color: 'gray', marginLeft: '7px' }}>{date[i]}</span></h4>
                            <p style={{ color: '#fff', margin: 0, lineHeight: '0.95', wordBreak: 'break-word', marginBottom:'5px' }}>{a.comment}</p>
                            <p style={{ color: 'gray', fontSize: '15px', cursor: 'pointer' }} onClick={() => {
                                SubCommentName(`@${writer.name} `)
                                PushCommentId(a._id)
                                setOpensubcomment(true)
                                setClosecomment(true)
                                CloseComment(true)

                            }}>답글달기</p>


                            {
                                subcommentlist.length !== 0 ? <p className="p10" style={{ color: 'gray', cursor: 'pointer' }} onClick={(e) => {
                                    e.target.style.display = 'none'
                                    setSubcomment(true)
                                    fetch('/api/subcomment/list/' + a._id).then((r) => r.json()).then((h) => {
                                        setSubCommentList(h);

                                        cirsubdate = h.map((a, i) => {
                                            return circulaterDate(a)
                                        })
                                        setSubdate(cirsubdate)
                                    })

                                }}> ──── 댓글{subcommentlist.length}개 모두보기</p> : null
                            }


                            <div style={{ display: 'flex', flexDirection: 'column-reverse', width: 'calc(100vw - 57px)' }}>
                                {
                                    subcomment ? subcommentlist.map((b, i) => {
                                        if (a._id == b.parent) {
                                            return (
                                                <SubCommentList key={i} b={b} i={i} subdate={subdate} session={session} AddCommentName={AddCommentName} OpenAddInput={OpenAddInput} OpenMainInput={OpenMainInput} OpenSubInput={OpenSubInput} />
                                            )
                                        }

                                    }) : null
                                }

                            </div>

                        </div>
                    </div>
                }
                <div className="like" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: 'max-content' }}>
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
        </div>
    )
}