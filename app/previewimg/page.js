'use client'

import { useEffect, useState } from "react"


export default function PreviewImg({ a, i, d, SetPos, posCopy, pos }) {

    let k = (window.innerWidth - 80) / 2
    k > 768 ? k = 768 : k = k
    let [startPosY, setStartPosY] = useState(0)
    let [draggingPosY, setDraggingPosY] = useState(0)
    let [endPosY, setEndPosY] = useState(k)
    let [dragging, setDragging] = useState(-1)


    useEffect(() => {
        let Copy = pos
        Copy[i] = endPosY
        SetPos(Copy)
    }, [endPosY])


    const TouchStart = (e) => {
        setDragging(i); e.stopPropagation(); setStartPosY(e.touches[0].clientY);

    }

    const TouchMove = (e) => {
        e.stopPropagation(); if (dragging == i) {
            setDraggingPosY(e.touches[0].clientY - startPosY);
            e.target.style.top = `${e.touches[0].clientY - startPosY + endPosY}px`;
        }
    }

    const TouchEnd = (e) => {
        e.stopPropagation()
        setDragging(-1);
        const range = e.target.clientHeight / 2 - k
        endPosY + draggingPosY >= k + range ? setEndPosY(k + range) :
            endPosY + draggingPosY <= k - range ? setEndPosY(k - range) : setEndPosY(endPosY + draggingPosY)
        e.target.style.top = `${endPosY}px`;
    }

    return (
        <div className="img-wrap" style={{ width: 'calc(100vw - 80px)', maxWidth: '768px', maxHeight: '768px', height: 'calc(100vw - 80px)', position: 'absolute', overflow: 'hidden',top :0, left:0 }} >
            <img draggable="true" className={d + ' selected-img selected-img' + i} src={a.preview} alt={`Preview ${i}`} style={{ position: 'absolute', width: '100%', top: `${endPosY}px`, transform: 'translate3d(0,-50%,0)' }}
                onTouchStart={TouchStart}
                onTouchMove={TouchMove}
                onTouchEnd={TouchEnd}

            />
        </div>
    )
}