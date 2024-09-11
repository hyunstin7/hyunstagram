'use client'

import circulaterDate from "@/util/CirculateDate";
import { useEffect, useRef, useState } from "react"
import CommentList from '../commentlist/page'


export default function Comment({a,session,i,bool1,bool2,writer}){
    let cirdate;
    const inputRef = useRef(null);
    let [subcomment, setSubcomment] = useState('')
    let [comment, setComment] = useState('')
    let [commentList, setCommentList] = useState([])
    let [date, setDate] = useState([])
    let [openSubCommentInput, setOpenSubCommentInput] = useState(false)
    let [commentid, setCommentid] = useState()
    let [subcommentlist1,setSubCommentList1] = useState([])
    let [openMainCommentInput,setOpenMainCommentInput] = useState(false)
    const [blockBtn,setBlockBtn] = useState(true)
    
    //  댓글창 닫기 감지
    const CloseComment = (e) => {
        setOpenSubCommentInput(e)
        setOpenMainCommentInput(!e)
    }

    // 서브댓글창에서 작성자 이름 수집
    const SubCommentName = (e) => {
        setSubcomment(e)
    }


    // 해당댓글 id찾기 서브댓글의 parent에 등록하기위함
    const PushCommentId = (e) => {
        setCommentid(e)
    }

    const OpenMainInput = (e) => {
        setOpenMainCommentInput(e)
    }

    const OpenSubInput = (e) => {
        setOpenSubCommentInput(e)
    }

     //메인 댓글등록
     const uploadComment = async () => {
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
    }


     //서브 댓글 등록
    const uploadSubComment = async () => {
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
    }

    const mountHandler = async () => {
        //댓글 등록 날짜 계산
        const res = await fetch('/api/comment/list/' + a._id)
        const result = await res.json()
        if(res.ok){
            setCommentList(result);
    
            cirdate = result.map((a) => {
                return circulaterDate(a)
            })
            setDate(cirdate)
        }

           //서브댓글목록 가져오기
    commentid && await fetch('/api/subcomment/list/' + commentid).then((r) => r.json()).then((e) => {
        setSubCommentList1(e);
    }) 
   }


    //댓글쓰기 감지될때마다 서브댓글or메인댓글에 따른 input노출
    useEffect(() => {
        setOpenMainCommentInput(bool1)
        setOpenSubCommentInput(bool2)
    }, [bool1,bool2])


 

    useEffect(() => {
       mountHandler()

        // 댓글창열기 이벤트
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
        
        window.addEventListener('click', handleClickOutside);

        // 컴포넌트가 언마운트될 때 댓글창열기 이벤트제거
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [])


    


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
                    if(blockBtn){
                        setBlockBtn(false)
                        uploadSubComment()
                        setTimeout(()=>{
                                        setBlockBtn(true)
                                        },1000)
                    }
                   
                }}><p style={{ width : 'max-content', borderRadius : '10px', color : '#fff', fontSize : '30px'}}>▲</p></button>
                </div>
                </div>  : null
               

            }
               
            {
                session && openMainCommentInput &&  <div className="input-bg">
                <div className="input-comment" >
                <input id="input1" onChange={(e)=>{setComment(e.target.value)}} placeholder={writer.name +'님에게 댓글추가'} value={comment} style={{ padding : '0 10px'}} ref={inputRef}></input>
                <button style={{ marginLeft : '5px', width : 'max-content', display : 'block'}} onClick={async()=>{
                    if(blockBtn){
                        setBlockBtn(false)
                        uploadComment()
                        setTimeout(()=>{
                                        setBlockBtn(true)
                                        },1000)
                    }
                   
                }}><p style={{ width : 'max-content', borderRadius : '10px', color : '#fff', fontSize : '30px'}}>▲</p></button>
                </div>
                </div>
            }

            
        </div>
    )
}