'use client';
import Comment from "@/app/comment/page";
import LoginModal from "@/app/loginmodal/page";
import circulateDate from "@/util/CirculateDate";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Detail(props) {
  let i = 0;
  let windowWidth = window.innerWidth
    const [user, setUser] = useState(null);
    const [a, setA] = useState(null);
    const [myCommentList, setMyCommentList] = useState([]);
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');
    const [expand, setExpand] = useState(false);
    const [menu, setMenu] = useState(false);
    const [likebtn, setLikebtn] = useState(false);
    const [likearr, setLikearr] = useState([]);
    const [comment, setComment] = useState(false);
    const [commentcount, setCommentcount] = useState(0);
    const [commentInput, setCommentInput] = useState(false);
    const [commentContent, setCommentContent] = useState('');
    const [openshare, setOpenShare] = useState(false);
    const [sliderNum, setSliderNum] = useState(0);
    const [endPosX, setEndPosX] = useState(0);
    const [startPosX, setStartPosX] = useState(0);
    const [draggingPosX, setDraggingPosX] = useState(0);
    let [bool1, setBool1] = useState(false)
    let [bool2, setBool2] = useState(false)
    let [bool3, setBool3] = useState(false)
    const [openModal, setOpenModal] = useState(false)
  
    useEffect(() => {
        const fetchData = async () => {
            try {
               

                const res = await fetch(`/api/detail/${props.params.id}`)
                const data = await res.json();
                await setA(data.a);
                await setUser(data.user);

                
                setLikearr(data.a.likes);
                setLikebtn(data.a.likes.indexOf(user?.name) === -1);
                setDate(circulateDate(data.a));
                
                const commentCountRes = await fetch(`/api/comment/count/${data.a._id}`);
                const commentCount = await commentCountRes.json();
                setCommentcount(commentCount.length);

                const commentListRes = await fetch(`/api/comment/list/${data.a._id}`);
                const comments = await commentListRes.json();
                setMyCommentList(comments.filter(comment => comment.name === user?.name));

                const parseTextWithBreaks = () => {
                    const regex = '<br>';
                    const strArr = data.a.content.split(regex);
                    const resultArr = strArr.flatMap((item, index) =>
                        index > 0 ? [regex, item] : [item]
                    ).filter(item => item !== '');

                    return resultArr.map((line, index) =>
                        line === regex ? <br key={index} /> : line
                    );
                };

                setContent(parseTextWithBreaks());
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);



    const TouchStart = (e) => setStartPosX(e.touches[0].clientX);
    const TouchMove = (e) => {
        setDraggingPosX(e.touches[0].clientX - startPosX);
        e.target.style.transition = "none";
        e.target.style.transform = `translate3d(${e.touches[0].clientX - startPosX + endPosX}px,0,0)`;
    };
    const TouchEnd = (e) => {
        const threshold = window.innerWidth * 0.3;
        const newSliderNum = draggingPosX < -threshold
            ? Math.min(sliderNum + 1, a.images.length - 1)
            : draggingPosX > threshold
            ? Math.max(sliderNum - 1, 0)
            : sliderNum;
        setSliderNum(newSliderNum);
        setEndPosX(-newSliderNum * window.innerWidth);
        e.target.style.transition = "transform 0.2s ease-out";
        e.target.style.transform = `translate3d(${endPosX}px,0,0)`;
    };

    const LikeUp = async () => {
        const updatedLikes = [...likearr];
        if (!updatedLikes.includes(user.name)) {
            updatedLikes.unshift(user.name);
        }
        setLikearr(updatedLikes);
        await fetch(`api/list/likes/${a._id}`, {
            method: 'POST',
            body: JSON.stringify(updatedLikes),
            headers: { 'Content-Type': 'application/json' }
        });
        setLikebtn(false);
    };

    const LikeDown = async () => {
        const updatedLikes = likearr.filter(name => name !== user.name);
        setLikearr(updatedLikes);
        await fetch(`api/list/unlike/${a._id}`, {
            method: 'DELETE',
            body: JSON.stringify(updatedLikes),
            headers: { 'Content-Type': 'application/json' }
        });
        setLikebtn(false);
    };

    function handleClickOutside(event) {
           
      setComment(!comment);
      setBool1(false)
      setBool2(false)
      fetch('/api/comment/count/' + a._id,
          {
              method: 'GET',
          }
      ).then((r) => r.json())
          .then((result) => {
              setCommentcount(result.length)
          })
      }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href + '/detail/' + a._id);
            alert('주소가 복사되었습니다!');
        } catch (err) {
            alert('에러 발생');
        }
    };

    const sharePage = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: document.title,
                    url: window.location.href,
                });
            } catch (err) {
                alert('공유 실패');
            }
        } else {
            alert('공유를 지원하지 않는 기기입니다.');
        }
    };

    const SendOpenModal = (e) =>{
        setOpenModal(e)
    }

    const handleLoginClick = () => {
        setOpenModal(true)
    };

    return (
        <div style={{ position: 'relative', width : '100%', height : '100vh', display : 'flex', justifyContent : 'center', alignItems : 'center'}}>
         {
          a && 
          <div style={{width : '100%'}}>
            {
                !user && <button onClick={handleLoginClick}>로그인</button> 
            }
            {
                openModal && <LoginModal 
                props={props}
                SendOpenModal={SendOpenModal}
                />
            }
             {
                openshare && 
                <div className="share-wrap" onClick={()=>{setOpenShare(!openshare)}} style={{ display : 'flex', justifyContent: 'center', alignItems : 'center', position: 'fixed', width : '100vw', height : '100vh',top : 0, left : 0, zIndex : 999999, background :'#00000071'}}>
                <div className="share-box move-bt2" onClick={(e)=>{e.stopPropagation()}}
                style={{ 
                    borderRadius : '10px', 
                    overflow : 'hidden', 
                    display : 'flex', 
                    position : 'absolute', 
                    bottom : 0, 
                    width : '100%', 
                    justifyContent : 'center',
                    alignItems : 'center', 
                    borderRadius : '20px 20px 0 0', 
                    background : '#1b1b1b',
                    padding : '10px 0'}}>
                    <div style={{ display: 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column'}}
                    onClick={()=>{
                        sharePage()
                    }}>
                    <div className="img-wrapper" style={{width: '40px', height : '40px', marginBottom : '5px', display : 'flex', justifyContent : 'center', alignItems : 'center', padding: '5px', background : '#383838', borderRadius : '50%'}}>
                        <img style={{width : '20px'}} src="/img/share2.png"></img>
                    </div>
                    <p style={{ color : '#fff', fontSize : '10px'}}>공유하기</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent : 'center', alignItems : 'center', flexDirection : 'column'}}
                    onClick={()=>{
                        copyToClipboard()
                    }}>
                    <div className="img-wrapper" style={{  width: '40px', height : '40px', marginBottom : '5px', display : 'flex', justifyContent : 'center', alignItems : 'center', padding: '5px', background : '#383838', borderRadius : '50%'}}>
                        <img style={{width : '20px'}} src="/img/link.png"></img>
                    </div>
                    <p style={{ color : '#fff', fontSize : '10px'}}>링크복사</p>
                    </div>
                </div>
            </div>
            }

            
            {
                comment ? <div className="comment-modal comment-expand" onClick={()=>{handleClickOutside()}}><Comment a={a} key={i} i={i} user={user} bool1={bool1} bool2={bool2} bool3={bool3} /></div> : null
            } 

            <Link href={`/detail/${a._id}`}><div onClick={(e) => { e.preventDefault(); }} style={{ display: 'flex', alignItems: 'center' ,padding : '0 10px'}}><img src={'/' + a.profileImg} width={'20px'}></img><h4 style={{ color: '#fff' }}>{a.name}</h4><p style={{ color: 'grey' }}> · {date}</p></div> </Link>
            <div style={{ position: 'absolute', top: 0, right: '10px', display: 'flex', alignItems : 'flex-end' ,zIndex : '99'}}>
                
                
            </div>

            <div className="imgslide-wrap" style={{ width: '100%', overflow: 'hidden', aspectRatio : '1/1', position: 'relative', marginBottom : '35px' }}>
                <div className="imgslide" style={{ display: 'flex', margin : '5px 0', position : 'absolute', top: 0, left :0, transform: `translate3d(${endPosX}px,0,0)`,width : '100%',}}
                onDragStart={()=>{}}
                onDrag={()=>{}}
                onDragEnd={()=>{}}
                onTouchStart={(e)=>{ if(a.images.length > 1){TouchStart(e)}}}
                onTouchMove={(e)=>{if(a.images.length > 1){TouchMove(e)}}}
                onTouchEnd={(e)=>{if(a.images.length > 1){TouchEnd(e)}}}
                >
               
                    {
                        a.images.map((t, g) =>
                            <div className={"imgslider" + g} key={g} onTouchStart={(e)=>{e.stopPropagation()}} style={{ pointerEvents :'none',width : '100%',}}
                        onTouchMove={(e)=>{e.stopPropagation()}}
                        onTouchEnd={(e)=>{e.stopPropagation()}}>
                                <div className="collection-wrap" style={{ width : '100%',
                                    filter:
                                        `brightness(${a.correction[g].brightness}) 
                                         contrast(${a.correction[g].contrast}) 
                                         saturate(${a.correction[g].saturation}) 
                                         hue-rotate(${a.correction[g].temperature}deg) 
                                         blur(${a.correction[g].blur}px)`
                                }}>
                                    <div className={"filter-wrap " + a.filter[i]} style={{ position: 'relative', width: '100%', aspectRatio : '1/1', overflow: 'hidden' }}>
                                        <img src={`https://hyunstagram.s3.ap-northeast-2.amazonaws.com/${t}`} style={{ width: '100%', position: 'absolute', left: '50%', top: `${a.pos[g] * windowWidth / (windowWidth - 80)}px`, transform: 'translate3d(-50%,-50%,0)' }}></img>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="slide-dot" style={{ display: 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', height : '25px', marginTop : '102vw'}}>

                    {
                        a.images.length > 1 && a.images.map((a,i)=>
                            <span className={"dot" + i + " dot"} key={i} style={{ display : 'inline-block', margin : '0 1px'}}>●</span>
                        )
                    }
                </div>
            </div>
            <div style={{ padding : '0 15px'}}> 

            <div style={{ marginBottom : '5px', width : '100%', display : 'flex', justifyContent :'space-between', alignItems: 'center'}}>       
            <div style={{ display : 'flex', width : '100px', justifyContent :'space-between', alignItems: 'center'}}>
            {
                
                likebtn ?
                    user ? likearr.indexOf(user.name) !== -1 ?
                        <img width={'22px'} height={'22px'} src="/img/like.png" onClick={() => {
                            LikeDown()
                        }}></img>
                        :
                        <img width={'22px'} height={'22px'} src="/img/unlike.png" onClick={async () => {
                            LikeUp()
                        }}></img>

                        : <img width={'22px'} height={'22px'} src="/img/unlike.png" onClick={() => {
                            alert('로그인부터 쳐해라 뒤지기싫으면')
                        }}></img> :
                    user ? likearr.indexOf(user.name) !== -1 ?
                        <img width={'22px'} height={'22px'} src="/img/like.png" onClick={() => {
                            LikeDown()
                        }}></img>
                        :
                        <img width={'22px'} height={'22px'} src="/img/unlike.png" onClick={async () => {
                            LikeUp()
                            setLikebtn(true)
                        }}></img>

                        : <img width={'22px'} height={'22px'} src="/img/like.png" onClick={() => {
                            alert('로그인부터 쳐해라 뒤지기싫으면')
                        }}></img>

            }
            
                <img src="/img/chat.png" width={'22px'} height={'22px'} onClick={() => {
                setComment(!comment)
                setBool1(true)
                setBool2(false)
                setBool3(false)

            }}></img> 
                <img 
                onClick={()=>{setOpenShare(!openshare)}}
                src="/img/share.png"  width={'22px'} height={'22px'} ></img>
            </div> 
            <img src="/img/bookmark.png" width={'22px'} height={'22px'}></img>
                
            </div>




            
            <h2 style={{ fontSize: '15px', cursor: 'pointer', color: '#fff' }}>좋아요 {likearr.length}개</h2>
            <p style={{ color: '#fff' }} className={`detail${i} detail`}>
                {
                    expand ? content : a.content.includes('<br>') ?
                        a.content.split(/(<br>)+/)[0] : a.content
                }</p>
            {
                a.content.includes('<br>') ? <span style={{ cursor: 'pointer', display: 'inline-block' }} onClick={
                    (e) => {
                        e.target.style.display = 'none';
                        setExpand(true)
                    }}>...더 보기</span> : null
            }
            {commentcount == 0 ? null : <p style={{ color: 'gray', cursor: 'pointer' }} onClick={() => {
                setComment(!comment)
                setBool1(true)
                setBool2(false)
                setBool3(false)

            }}>댓글{commentcount}개 모두보기</p>}
            <div style={{ paddingLeft : '0px'}}>
         
            </div>
            {
                user && <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="profile-img"><img src={'/' + user.image}></img></div><p style={{ marginLeft: '5px', padding: '0 5px', outline: 'none', border: 'none', color: 'gray', cursor: 'pointer' }} onClick={() => {
                setCommentInput(!commentInput) 
                    }}>...댓글달기</p>
                </div> 
            }
            {user && commentInput &&
                    <div  className="move-bt" style={{ position : 'fixed', width : '100%', height : '100vh', top: 0, left :0, zIndex : '9999999999999'}} onClick={(e)=>{e.stopPropagation(); setCommentInput(!commentInput)}}>
                        <div className="direct-input-bg" onClick={(e) => { e.stopPropagation() }}>
                            <div className="input-comment" >
                                <input id="input1" onChange={(e) => { setCommentContent(e.target.value) }} placeholder={a.name + '님에게 댓글추가'} value={commentContent} style={{ padding: '0 10px' }}></input>
                                <button style={{ marginLeft: '5px', width: 'max-content', display: 'block' }} onClick={async () => {
                                    await fetch('/api/comment/' + a._id,
                                        {
                                            method: 'POST',
                                            headers : {'Content-Type':'application/json'},
                                            body: JSON.stringify({comment : commentContent})
                                        })
                                        .then((r) => r.json())
                                        .then((result) => {
                                            setCommentcount(result.length)
                                        })
                                    await fetch('/api/comment/list/' + a._id).then((r) => r.json()).then((e) => {
                                        let result = e.filter(e => e.name == user.name)
                                        setMyCommentList(result);
                                    })
                                    await setCommentContent('')
                                    await setCommentInput(!commentInput)
                                }}><p style={{ width: 'max-content', borderRadius: '10px', color: '#fff', fontSize: '30px' }}>▲</p></button>
                            </div>
                        </div>
                    </div>
            }

            </div>
            </div>
         }
        </div>
    );
}
