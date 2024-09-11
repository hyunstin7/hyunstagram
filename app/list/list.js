'use client';

import { useEffect, useRef, useState } from "react";
import ListItem from "../listitem/page";

export default function List({ session }) {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  // 게시글 데이터를 가져오는 함수
  const getList = async () => {
    setLoading(true);
    const res = await fetch(`/api/list?page=${page}&limit=5`);
    const newList = await res.json();
    
    if(res.ok){
        setList((prevList) => [...prevList, ...newList]);
        setLoading(false);
    }
    // 더 이상 가져올 게시글이 없는 경우
    if (newList.length < 5) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    getList();
  }, [page]);

  // 스크롤 감지 및 페이지 업데이트
  const lastPostElementRef = (node) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();  // 이전 observer 해제

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      {
        threshold: 1,  // 요소가 100% 보일 때만 실행
      }
    );

    if (node) observer.current.observe(node); 
  };

  return (
    <div className="list-bg">
      {list &&
        list.map((a, i) => (
          <ListItem
            ref={i === list.length - 1 ? lastPostElementRef : null}  // 마지막 게시글에만 ref 할당
            a={a}
            session={session}
            i={i}
            key={i}
          />
        ))}
        {
            loading && <p style={{textAlign:'center'}}>가져오는중...</p>
        }
    </div>
  );
}
