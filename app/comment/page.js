'use client'

import circulaterDate from "@/util/CirculateDate";
import { useEffect, useRef, useState } from "react"
import CommentList from '../commentlist/page'


export default function Comment({a,session,i,bool1,bool2,writer}){
    let cirdate;
    let [subcomment, setSubcomment] = useState('')
    let [comment, setComment] = useState('')
    let [commentList, setCommentList] = useState([])
    let [date, setDate] = useState([])
    let [openSubCommentInput, setOpenSubCommentInput] = useState(false)
    let [commentid, setCommentid] = useState()
    let [subcommentlist1,setSubCommentList1] = useState([])
    let [openMainCommentInput,setOpenMainCommentInput] = useState(false)
    

    const CloseComment = (e) => {
        setOpenSubCommentInput(e)
        setOpenMainCommentInput(!e)
    }

    const SubCommentName = (e) => {
        setSubcomment(e)
    }

    const PushCommentId = (e) => {
        setCommentid(e)
    }

    const OpenMainInput = (e) => {
        setOpenMainCommentInput(e)
    }

    const OpenSubInput = (e) => {
        setOpenSubCommentInput(e)
    }

  



  

    useEffect(() => {
        setOpenMainCommentInput(bool1)
        setOpenSubCommentInput(bool2)
    }, [bool1,bool2])

    
    useEffect(() => {
        fetch('/api/comment/list/' + a._id).then((r) => r.json()).then((e) => {
            setCommentList(e);

            cirdate = e.map((a, i) => {
                return circulaterDate(a)
            })
            setDate(cirdate)
        })

        commentid ? fetch('/api/subcomment/list/' + commentid).then((r) => r.json()).then((e) => {
            setSubCommentList1(e);
        }) : null

       

       


        function handleClickOutside(event) {
            const modal = document.querySelectorAll('.comment-modal')[i];
            if (modal == event.target) {
                modal.classList.remove('comment-expand');
                setSubcomment('');
                setOpenSubCommentInput(false)
                setComment('')
                setOpenMainCommentInput(false)
            }
        }

        // 이벤트 리스너 추가
        window.addEventListener('click', handleClickOutside);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [])


    const inputRef = useRef(null);

    // useEffect(() => {
    //     // 컴포넌트가 마운트된 후 인풋에 포커스를 맞추기
    //     if (inputRef.current) {
    //         inputRef.current.focus(); // 포커스 맞추기
    //     }
    // }, [openMainCommentInput]);


    


 
    
    

    

    return(
        <div className="comment-box" onClick={(e)=>{e.stopPropagation()}}>
            <p style={ {borderBottom : '1px solid gray', padding : '10px 0',  color : "#fff", textAlign : 'center'}}>댓글</p>
            <div style={{display : 'flex', flexDirection : 'column-reverse', width : '100%'}}>
            {
                commentList == [] || commentList == null || commentList == undefined || commentList == '' ?  <p style={{color : '#fff', textAlign : 'center', marginTop:'100px'}}>현재 댓글이 존재하지 않습니다</p>: commentList.map((a,i)=>{
                    
                    return(
                        <CommentList 
                        a={a} 
                        i={i} 
                        date={date} 
                        session={session} 
                        key={i}
                        CloseComment={CloseComment} 
                        SubCommentName={SubCommentName} 
                        PushCommentId={PushCommentId}
                        subcommentlist1={subcommentlist1}
                        OpenMainInput={OpenMainInput}
                        OpenSubInput={OpenSubInput}
                        />
                    )
                }) 
            }
            </div>
            {
                session && openSubCommentInput ?  <div className="input-bg sub-input-bg">
                <div className="input-comment" >
                <input id="input1" onChange={(e)=>{setSubcomment(e.target.value);}} value={subcomment} style={{ padding : '0 10px'}}></input>
                <button style={{ marginLeft : '5px', width : 'max-content', display : 'block'}} onClick={async ()=>{
                   await fetch('/api/subcomment/' + commentid,
                { 
                    method : 'POST' ,
                    headers : {'Content-Type':'application/json'},
                    body : JSON.stringify({ comment : subcomment})
                })
                .then((r)=>r.json())
                .then((e)=>{ if(e == ''){alert('로그인 이후 이용 가능합니다.')}else{setSubCommentList1(e); 
                    setSubcomment('')
                    setOpenMainCommentInput(true)
                }})
                }}><p style={{ width : 'max-content', borderRadius : '10px', color : '#fff', fontSize : '30px'}}>▲</p></button>
                </div>
                </div>  : null
               

            }
               
            {
                session && openMainCommentInput &&  <div className="input-bg">
                <div className="input-comment" >
                <input id="input1" onChange={(e)=>{setComment(e.target.value)}} placeholder={writer.name +'님에게 댓글추가'} value={comment} style={{ padding : '0 10px'}} ref={inputRef}></input>
                <button style={{ marginLeft : '5px', width : 'max-content', display : 'block'}} onClick={async()=>{
                    await fetch('/api/comment/' + a._id,
                { 
                            method: 'POST',
                            headers: {'Content-Type' : 'application/json'},
                            body: JSON.stringify({comment,})
                        })
                .then((r)=>r.json())
                .then((e)=>{ if(e == ''){alert('로그인 이후 이용 가능합니다.')}else{setCommentList(e); 
                    cirdate = e.map((a,i)=>{
                        return circulaterDate(a)
                    })
                    setDate(cirdate)
                    setComment('')
                    
                }})
                }}><p style={{ width : 'max-content', borderRadius : '10px', color : '#fff', fontSize : '30px'}}>▲</p></button>
                </div>
                </div>
            }

            
        </div>
    )
}