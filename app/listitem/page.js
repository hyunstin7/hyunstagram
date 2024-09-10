'use client'

import circulaterDate from "@/util/CirculateDate";
import Link from "next/link";
import { useEffect, useState } from "react";
import Comment from '@/app/comment/page'
import MyCommentList from "../mycommentlist/page";




export default function ListItem({ a, session, i }) {


    let [myCommentList, setMyCommentList] = useState([])
    let [content, setContent] = useState()
    let [date, setDate] = useState()
    let [expand, setExpand] = useState(false)
    let [menu, setMenu] = useState(false)
    let txtencoder;
    let [likebtn, setLikebtn] = useState()
    let [likearr, setLikearr] = useState([])
    let [comment, setComment] = useState(false)
    let [commentcount, setCommentcount] = useState(0)
    let [bool1, setBool1] = useState(false)
    let [bool2, setBool2] = useState(false)
    let [bool3, setBool3] = useState(false)
    let [commentInput, setCommentInput] = useState(false)
    let [commentContent, setCommentContent] = useState('')
    let [openshare, setOpenShare] = useState(false)
    let [bookmark, setBookmark] = useState([])
    let [bookmarkBtn, setBookmarkBtn] = useState(false)
    let [openBookmark, setOpenBookmark] = useState(0)
    let [user,setUser] = useState(session.user)
    const [writer, setWriter] = useState(null)
    const [followBoolean,setFollowBoolean] = useState(false)
    const [blockBtn,setBlockBtn] = useState(true)

    let windowWidth = window.innerWidth


    const [sliderNum, setSliderNum] = useState(0);
   
   
    
    useEffect(()=>{
        setFollowBoolean(!followBoolean)
    },[user])

    const BookMarkUploadHandler = async () => {


        const res = await fetch('/api/bookmark/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: a._id })
        })
        if (res.ok) {
            const bookmark = await res.json()
            await setBookmark(bookmark)
            await setBookmarkBtn(true)
            await setOpenBookmark(1)
        }
    }
    const BookMarkDeleteHandler = async () => {
        const res = await fetch('/api/bookmark/update', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: a._id })
        })
        if (res.ok) {
            const bookmark = await res.json()
            await setBookmark(bookmark)
            await setBookmarkBtn(false)
            await setOpenBookmark(2)

        }

    }




    let LikeUp = () => {
        let arr = [...likearr]
        if (arr.indexOf(session.user.email) == -1) {
            arr.unshift(session.user.email)
        }
        setLikearr(arr)
        fetch('api/list/likes/' + a._id, {
            method: 'POST',
            body: JSON.stringify(arr)
        })
        setLikebtn(false)
    }

    let LikeDown = () => {
        let arr = [...likearr]
        arr = arr.filter((e) => e !== session.user.email)
        setLikearr(arr)
        fetch('api/list/unlike/' + a._id, {
            method: 'DELETE',
            body: JSON.stringify(arr)
        })
        setLikebtn(false)
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
        setBookmark(session.user.bookmark)
        setLikearr(a.likes)
        session ? a.likes.indexOf(session.user.email) == -1 ? setLikebtn(true) : setLikebtn(false) : setLikebtn(true)
        fetch('/api/comment/count/' + a._id,
            {
                method: 'GET',
            }
        ).then((r) => r.json())
            .then((result) => {
                setCommentcount(result.length)
            })
        setDate(circulaterDate(a))

        fetch('/api/comment/list/' + a._id).then((r) => r.json()).then((e) => {
            let email;
            session ? email = session.user.email : email = email

            let result = e.filter(e => e.author == email)
            setMyCommentList(result);

        })


        let parseTextWithBreaks = () => {
            // 문자열 내의 '<br>'을 실제 <br> 요소로 변환하는 정규 표현식
            const regex = '<br>'
            const strArr = a.content.split(regex)
            const resultArr = [];
            strArr.forEach((a, i) => {
                if (i > 0) resultArr.push(regex); // 첫 번째 부분은 건너뛰고 기준 문자열을 추가
                resultArr.push(a);
            })

            const filterArr = resultArr.filter((e) => e !== '')

            return filterArr.map((line, index) => {
                // ''이 나타나면 <br> 요소로 반환
                if (line == '<br>') {
                    return <br key={index} />;
                }
                // 그렇지 않으면 일반 텍스트 반환
                return line;
            });
        }


        txtencoder = (a) => {
            let encoder = new TextEncoder();

            // 문자열을 UTF-8로 인코딩하여 Uint8Array를 얻음
            let encoded = encoder.encode(a);

            // 인코딩된 Uint8Array에서 처음부터 10바이트까지 추출
            let slicedBytes = encoded.slice(0, 120);

            // UTF-8로 디코딩하여 문자열로 변환
            let slicedString = new TextDecoder().decode(slicedBytes);
            return slicedString
        }

        setContent(parseTextWithBreaks())


        //     클릭 이벤트 핸들러 함수

        const slide = document.querySelector('.imgslide' + i);
        const sliders = document.querySelectorAll('.imgslide' + i + ' .imgslider');
        const dots = document.querySelectorAll('.list-item' + i + ' .dot')
       
        
       
    
    if(slide){
        slide.addEventListener('scroll', () => {
            const scrollLeft = slide.scrollLeft;
       
            // 각 슬라이드의 위치를 계산해서 현재 슬라이드 감지
            sliders.forEach((slider, index) => {
              const sliderOffset = slider.offsetLeft;

              // 스크롤이 슬라이드의 중간을 지났는지 확인
              if (scrollLeft >= sliderOffset - slider.offsetWidth / 2) {
                setSliderNum(index);
                const dot = document.querySelector('.list-item' + i + ' .dot' + index)

                dots.forEach((a)=>{
                    a.style.color = '#fff'
                })
                dot.style.color = '#295ce9'
              }
            });
          });
    }



    }, [])

    const HandleFollow = async (followingEmail, followerEmail) => {
        const res = await fetch('/api/following', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ followingEmail, followerEmail, })
        })
        
            const res2 = await fetch('/api/userinfo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email })
            })
            if (res2.ok) {
                const result = await res2.json()
                setUser(result)
            }
        
    }

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
            await navigator.clipboard.writeText(window.location.href + 'detail/' + a._id);
            alert('주소가 복사되었습니다!')
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
                alert('에러발생. 공유실패 errorcode :', err);
            }
        } else {
            alert('공유를 지원하지않는 기기입니다.');
        }
    };



    return (
        <div className={"list-item" + i + " list-item"} style={{ position: 'relative' , flex:'none', scrollSnapAlign:'start'}}>

            {
                openshare &&
                <div className="share-wrap" onClick={() => { setOpenShare(!openshare) }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, zIndex: 999999, background: '#00000071' }}>
                    <div className="share-box move-bt2" onClick={(e) => { e.stopPropagation() }}
                        style={{
                            borderRadius: '10px',
                            overflow: 'hidden',
                            display: 'flex',
                            position: 'absolute',
                            bottom: '50px',
                            width: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '20px 20px 0 0',
                            background: '#1b1b1b',
                            padding: '10px 0'
                        }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                            onClick={() => {
                                sharePage()
                            }}>
                            <div className="img-wrapper" style={{ width: '40px', height: '40px', marginBottom: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px', background: '#383838', borderRadius: '50%' }}>
                                <img style={{ width: '20px' }} src="/img/share2.png"></img>
                            </div>
                            <p style={{ color: '#fff', fontSize: '10px' }}>공유하기</p>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
                            onClick={() => {
                                copyToClipboard()
                            }}>
                            <div className="img-wrapper" style={{ width: '40px', height: '40px', marginBottom: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px', background: '#383838', borderRadius: '50%' }}>
                                <img style={{ width: '20px' }} src="/img/link.png"></img>
                            </div>
                            <p style={{ color: '#fff', fontSize: '10px' }}>링크복사</p>
                        </div>
                    </div>
                </div>
            }


            {
                comment ? <div className="comment-modal comment-expand" onClick={() => { handleClickOutside() }}><Comment a={a} key={i} i={i} session={session} bool1={bool1} bool2={bool2} bool3={bool3} writer={writer}/></div> : null
            }
            <div style={{ display: 'flex', alignItems: 'center', padding: '5px 10px', justifyContent: 'space-between' }}>

                {
                    writer && 
                    <div style={{display:'flex', alignItems:'center'}}>
                    <div onClick={(e) => { e.preventDefault(); }} style={{overflow: 'hidden', borderRadius: '50%',width:'30px',height:'30px', marginRight: '5px'}}>
                        <img src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + writer.image} style={{ width: '30px'}}>
                        </img>
                        </div>
                        <Link href={'/profile/' + writer.name}><h4 style={{ color: '#fff' }}>{writer.name}</h4></Link><p style={{ color: 'grey',fontSize:'14px' }}> · {date}</p>
                        </div>
                }
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', zIndex: '9', justifyContent: 'center' }}>
                    {
                        followBoolean ? user && user.email !== a.author ? user.following.filter((e) => e == a.author).length > 0 ? null :
                            <button style={{ padding: '5px 10px', background: '#295ce9', color: '#fff', borderRadius: '5px', marginRight: '10px', fontSize: '12px' }}
                                onClick={(e) => { HandleFollow(user.email, a.author); e.target.style.display = 'none' }}
                            >팔로우<span style={{display:'none'}}>{user.following.length}</span></button> : null
                            :
                            user && user.email !== a.author ? user.following.filter((e) => e == a.author).length > 0 ? null :
                            <button style={{ padding: '5px 10px', background: '#295ce9', color: '#fff', borderRadius: '5px', marginRight: '10px', fontSize: '12px' }}
                                onClick={(e) => { HandleFollow(user.email, a.author); e.target.style.display = 'none' }}
                            >팔로우<span style={{display:'none'}}>{user.following.length}</span></button> : null

                    }
                    <h2 onClick={() => { if (menu == false) { setMenu(true) } else { setMenu(false) } }} style={{ cursor: 'pointer' }}>···</h2>
                    {
                        session &&
                            session.user.email !== a.author ? null : menu ? <div style={{ width: 'max-content', display: 'flex', flexDirection: 'column', background: '#000', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: '100%', right: '0' }}>
                                <Link href={`/edit/${a._id}`}>수정하기</Link>
                                <button onClick={async (e) => {
                                    fetch(`/api/delete/${a._id} `, {
                                        method: 'DELETE',
                                        body: JSON.stringify({ author: a.author }),
                                        headers: { 'Content-Type': 'application/json' }
                                    }).then((r) => r.json)
                                        .then(() => {
                                            e.target.closest('.list-item').style.opacity = 0;
                                            setTimeout(() => {
                                                e.target.closest('.list-item').style.display = "none"
                                            }, 1000)
                                        })
                                }}>삭제하기</button>

                            </div> : null
                    }
                </div>
            </div>

            <div className="imgslide-wrap" style={{ width: '100%', overflow: 'hidden',  position: 'relative' }}>
                <div className={'imgslide imgslide' + i} style={{ display: 'flex', margin: '5px 0', overflowX :'scroll', scrollSnapType:'x mandatory', scrollBehavior:'smooth' }}
                >

                    {
                        a.images.map((t, g) =>
                            <div className={"imgslider imgslider" + g} key={g}style={{ pointerEvents: 'none', width: '100vw', maxWidth: '576px',flex:'none',scrollSnapAlign:'center' }}>
                                <div className="collection-wrap" style={{
                                    width: '100%',
                                    filter:
                                        `brightness(${a.correction[g].brightness}) 
                                         contrast(${a.correction[g].contrast}) 
                                         saturate(${a.correction[g].saturation}) 
                                         hue-rotate(${a.correction[g].temperature}deg) 
                                         blur(${a.correction[g].blur}px)`
                                }}>
                                    <div className={"filter-wrap " + a.filter[i]} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                                        <img src={`https://hyunstagram.s3.ap-northeast-2.amazonaws.com/${t}`} style={{ width: '100%', position: 'absolute', left: '50%', top: `${a.pos[g] * (windowWidth / (windowWidth - windowWidth / 4.875)) * (document.querySelector('body').clientWidth / 390)}px`, transform: 'translate3d(-50%,-50%,0)' }}></img>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
                {
                    openBookmark == 1 && <div className="fade" style={{ width: '100%', padding: '15px 20px', borderRadius: '20px 20px 0 0', background: '#282828', position: 'absolute', bottom: '-1px', left: 0, transform: 'translate3d(0,100%,0)' }}>
                        <h2 style={{ color: '#295ce9', fontSize: '12px' }}>컬렉션에 저장됨</h2>
                    </div>
                }
                {
                    openBookmark == 2 && <div className="fade" style={{ width: '100%', padding: '15px 20px', borderRadius: '20px 20px 0 0', background: '#282828', position: 'absolute', bottom: '-1px', left: 0, transform: 'translate3d(0,100%,0)' }}>
                        <h2 style={{ color: '#295ce9', fontSize: '12px' }}>내컬렉션에서 삭제됨</h2>
                    </div>
                }

            </div>
            <div className="slide-dot" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '25px' }}>

                {
                    a.images.length > 1 && a.images.map((a, i) =>
                        <span className={"dot" + i + " dot"} key={i} style={{ display: 'inline-block', margin: '0 1px' }}>●</span>
                    )
                }
            </div>
            <div style={{ padding: '0 15px' }}>

                <div style={{ marginBottom: '5px', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', width: '100px', justifyContent: 'space-between', alignItems: 'center' }}>
                        {

                            likebtn ?
                                session ? likearr.indexOf(session.user.email) !== -1 ?
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
                                session ? likearr.indexOf(session.user.email) !== -1 ?
                                    <img width={'22px'} height={'22px'} src="/img/like.png" onClick={() => {
                                        LikeDown()
                                    }}></img>
                                    :
                                    <img width={'22px'} height={'22px'} src="/img/unlike.png" onClick={async () => {
                                        LikeUp()
                                    }}></img>

                                    : <img width={'22px'} height={'22px'} src="/img/unlike.png" onClick={() => {
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
                            onClick={() => { setOpenShare(!openshare) }}
                            src="/img/share.png" width={'22px'} height={'22px'} ></img>

                    </div>
                    {
                        bookmarkBtn ? session && !bookmark.includes(a._id) ?
                            <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/bookmark.png" width={'22px'} height={'22px'}
                                onClick={() => { BookMarkUploadHandler() }}
                            ></img> : <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/save-instagram.png" width={'22px'} height={'22px'}
                                onClick={() => { BookMarkDeleteHandler() }}
                            ></img> :
                            session && !bookmark.includes(a._id) ?
                                <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/bookmark.png" width={'22px'} height={'22px'}
                                    onClick={() => { BookMarkUploadHandler() }}
                                ></img> : <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/save-instagram.png" width={'22px'} height={'22px'}
                                    onClick={() => { BookMarkDeleteHandler() }}
                                ></img>
                    }

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
                <div style={{ paddingLeft: '0px' }}>
                    {

                        session && myCommentList.map((a, i) =>
                            <MyCommentList
                                key={i}
                                i={i}
                                a={a}
                                writer={writer}
                            />
                        )
                    }
                </div>
                {
                    session ? <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div className="profile-img"><img src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + session.user.image}></img></div><p style={{ marginLeft: '5px', padding: '0 5px', outline: 'none', border: 'none', color: 'gray', cursor: 'pointer' }} onClick={() => {
                            setCommentInput(!commentInput)
                        }}>...댓글달기</p>
                    </div> : null
                }
                {commentInput &&
                    <div className="move-bt" style={{ position: 'fixed', width: '100%', height: '100vh', top: 0, left: 0, zIndex: '9999999999999' }} onClick={(e) => { e.stopPropagation(); setCommentInput(!commentInput) }}>
                        <div className="direct-input-bg" onClick={(e) => { e.stopPropagation() }}>
                            <div className="input-comment" >
                                <input id="input1" onChange={(e) => { setCommentContent(e.target.value) }} placeholder={writer.name + '님에게 댓글추가'} value={commentContent} style={{ padding: '0 10px' }}></input>
                                <button style={{ marginLeft: '5px', width: 'max-content', display: 'block' }} onClick={async () => {
                                    if(blockBtn){
                                        setBlockBtn(false)
                                        await fetch('/api/comment/' + a._id,
                                            {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ comment: commentContent })
                                            })
                                            .then((r) => r.json())
                                            .then((result) => {
                                                setCommentcount(result.length)
                                            })
                                        await fetch('/api/comment/list/' + a._id).then((r) => r.json()).then((e) => {
                                            let email = session.user.email
                                            let result = e.filter(e => e.author == email)
                                            setMyCommentList(result);
    
    
                                        })
                                        await setCommentContent('')
                                        await setCommentInput(!commentInput)
                                        setTimeout(()=>{
                                        setBlockBtn(true)
                                        },1000)
                                    }
                                   
                                }}><p style={{ width: 'max-content', borderRadius: '10px', color: '#fff', fontSize: '30px' }}>▲</p></button>
                            </div>
                        </div>
                    </div>
                }

            </div>


        </div>
    )
}