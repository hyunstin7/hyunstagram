'use client';

import getUserInfo from "@/util/getuserinfo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Edit(props) {
    const [a, setA] = useState(null);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const router = useRouter();

    const windowWidth = window.innerWidth

    // 컴포넌트가 마운트될 때 데이터 가져오기
    const mountHandler = async () => {
        try {
            const res = await fetch('/api/getedit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: props.params.id })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            setA(data);
            setContent(data.content.replace(/<br\s*\/?>/gi, '\n')); // 초기 content 설정
        } catch (error) {
            console.error('Failed to fetch content:', error);
        } finally {
            setLoading(false); // 데이터 로드 완료 후 로딩 상태 변경
        }
    };

    useEffect(() => {
        mountHandler();
    }, []);

    // 폼 제출 핸들러
    const EditHandler = async (e) => {
        e.preventDefault();

        const user = await getUserInfo();

        try {
            const res = await fetch(`/api/edit/${props.params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, user })
            });
            const root = await res.json();
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            } else {
                router.push(root.root);
            }
        } catch (error) {
            console.error('Failed to edit content:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>; // 데이터가 로드될 때까지 로딩 메시지 표시
    }

    if (!a) {
        return <div>No data available</div>; // 데이터가 없을 경우의 처리
    }

    return (
        <div className="p-20">
            <form onSubmit={EditHandler} style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column', width: '100%', height: 'auto' }}>
                <div className="collection-wrap" style={{
                    width: '100%',
                    filter:
                        `brightness(${a.correction[0].brightness}) 
                                         contrast(${a.correction[0].contrast}) 
                                         saturate(${a.correction[0].saturation}) 
                                         hue-rotate(${a.correction[0].temperature}deg) 
                                         blur(${a.correction[0].blur}px)`
                }}>
                    <div className={"filter-wrap " + a.filter[0]} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', overflow: 'hidden' }}>
                        <img src={`https://hyunstagram.s3.ap-northeast-2.amazonaws.com/${a.images[0]}`} style={{ width: '100%', position: 'absolute', left: '50%', top: `${a.pos[0] * windowWidth / (windowWidth - 80)}px`, transform: 'translate3d(-50%,-50%,0)' }}></img>
                    </div>
                </div>
                <h4>글수정페이지</h4>
                <textarea
                    className="edit-input"
                    wrap="physical"
                    rows={5}
                    name="content"
                    type="text"
                    placeholder="글내용"
                    value={content} // controlled component로 수정
                    onChange={(e) => setContent(e.target.value)}
                    style={{ width: '100%' }}
                />
                <button type="submit">수정</button>
            </form>
        </div>
    );
}
