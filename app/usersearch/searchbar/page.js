'use client'

import Link from "next/link"
import { useEffect, useState } from "react"

export default function SearchBar({ users, myinfo }) {
    const [text, setText] = useState(null)
    const [result, setResult] = useState(null)
    const [current, setCurrent] = useState(myinfo.currentSearch || null)
    const [openCurrent, setOpenCurrent] = useState(false)
    const [openResult, setOpenResult] = useState(false)

    const highlightText = (text, query) => {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');

        return text.replace(regex, '<span style="background-color: blue;">$1</span>');
    };

    const CurrentDeleteHandler = async (e) => {
        let copy = [...current];
        const index = copy.indexOf(e)
        copy.splice(index, 1)
        setCurrent(copy)

        const res = await fetch('/api/search/current', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current: e })
        })
        const result = await res.json()
        if (res.ok) {
            setCurrent(result)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼의 기본 제출 동작을 막음
        setOpenCurrent(false)
        setOpenResult(true)
        setResult(text)

        const res = await fetch('/api/search/current', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ current: text })
        });
        const result = await res.json()
        if (res.ok) {
            await setText('')
            await setCurrent(result)
        }
    }
    useEffect(() => {

        if (text) {
            setOpenCurrent(false);
        } else {
            if (document.querySelector('.search-input').value) {
                setOpenCurrent(false);
            } else {
                setOpenCurrent(true);
            }


        }
    }, [text]);







    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', width: 'calc(100% - 30px)', margin: '10px 15px', padding: '10px 20px', border: 'solid #000 1px', borderRadius: '30px', background: '#fff' }}>
                <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/search.png" alt="" style={{ width: '20px' }} />

                <form action="/api/search/current" method="POST" onSubmit={handleSubmit} style={{ width: '100%' }}>

                    <input className="search-input" type="search" placeholder="검색" name="current"
                        onChange={(e) => {
                            setText(e.currentTarget.value);
                            setOpenResult(false)
                        }}
                        onFocus={(e) => {
                         if (e.currentTarget.value) { setOpenCurrent(false) } else {
                                setOpenCurrent(true)
                            }
                        }}
                        style={{ width: '100%', border: 'none', padding: '0 0 0 10px', outline: 'none' }} />
                </form>
            </div>
            {
                openCurrent &&

                <div style={{ display: 'flex', flexDirection: 'column', padding: '20px 50px' }}>
                    <p>최근검색</p>
                    {
                        current.length == 0 ? <p style={{ marginTop: '100px', textAlign: 'center' }}>검색내역이 없습니다</p> : current.map((a, i) =>
                            <div key={i} style={{ display: 'flex', alignItems: 'center', margin: '10px 0', width: '100%', justifyContent: 'space-between' }} onClick={() => {
                                setResult(a)
                                setOpenResult(true)
                                setOpenCurrent(false)
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src='https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/search-white.png' style={{ width: '22px', marginRight: '10px' }} /> <span style={{ color: '#fff', fontSize: '15px' }}>{a}</span>
                                </div>
                                <img src='https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/reject.png' onClick={(e) => { CurrentDeleteHandler(a); e.stopPropagation() }} style={{ cursor: 'pointer', width: '20px' }}></img>
                            </div>)
                    }
                </div>
            }
            {
                text &&
                <div style={{ display: 'flex', flexDirection: 'column', padding: '0 50px' }}>
                    {
                        users.filter((e) => e.name.includes(text)).map((a, i) =>
                            <Link href={"/profile/" + a.name} key={i} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }} >
                                <div style={{width:'30px', height:'30px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px'}}>
                                    <img src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + a.image} style={{ width: '30px' }} />
                                </div>
                                <span dangerouslySetInnerHTML={{ __html: highlightText(a.name, text) }}></span>
                            </Link>
                        )
                    }
                </div>
            }

            {openResult &&
                <div style={{ padding: '0 50px', display: 'flex', flexDirection: 'column' }}>
                    <p style={{ margin: '30px 0' }}>'{result}'에 대한 검색결과</p>
                    {
                        users.filter((e) => e.name.includes(result)).map((a, i) =>
                            <Link href={"/profile/" + a.name} key={i} style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                                <div style={{width:'30px', height:'30px', borderRadius: '50%', overflow: 'hidden', marginRight: '10px'}}>
                                    <img src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + a.image} style={{ width: '30px' }} />
                                </div>
                                <span>{a.name}</span>
                            </Link>
                        )
                    }
                    {
                        users.filter((e) => e.name.includes(result)).length == 0 &&
                        <p style={{ marginTop: '100px', textAlign: 'center' }}>검색내역이 없습니다</p>
                    }
                </div>
            }
        </div>
    )
}