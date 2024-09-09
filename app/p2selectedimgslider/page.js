'use client'

import { useEffect, useState } from "react"

export default function P2SelectedImgSlider({
    a,
    i,
    filter,
    ReceiveFilterNum,
    ReceiveOpenFilter,
    pos,
    ChangeCurrentFilter,
    ChangeFilterBtn,
    correctArr,
    DeleteImg,
    selectedFiles
}){

    useEffect(()=>{
        if(selectedFiles.length == 1){
            document.querySelectorAll('.p2-selected-img-slider .delete-btn').forEach((a)=>{a.style.display = 'none'})
            document.querySelector('.p2-seleted-img-slide').style.justifyContent = 'center'
        
        }else{
            document.querySelectorAll('.p2-selected-img-slider .delete-btn').forEach((a)=>{a.style.display = 'block'})
            document.querySelector('.p2-seleted-img-slide').style.justifyContent = 'flex-start'
        }
    },[selectedFiles])
    return(
        <div className={"p2-selected-img-slider p2-selected-img-slider" + i} 
        style={{ flex : '0 0 calc(100vw - 80px)', position : 'relative', transition : 'opacity 1s', borderRadius : '10px', overflow : 'hidden'}}
        onClick={(e) => {
                ReceiveFilterNum(i)
                ReceiveOpenFilter(0)
                ChangeCurrentFilter(filter)
                ChangeFilterBtn('filter')
        }}>
        <div className="correction-wrap" 
                                style={{filter : 
                                `brightness(${correctArr[i].brightness}) 
                                contrast(${correctArr[i].contrast}) 
                                saturate(${correctArr[i].saturation}) 
                                hue-rotate(${correctArr[i].temperature}deg) 
                                blur(${correctArr[i].blur}px)`}}
                                >
        <div className={"filter-wrap " + filter[i]}>
        <img 
            src={a.preview} alt={`Preview ${i}`} style={{ width: 'calc(100vw - 80px)', top : `${pos[i]}px`}}
             />
        </div>
        </div>
        <button className="delete-btn" style={{ borderRadius : '50%', padding : '5px' , width : '30px', height : '30px', background : '#242424', color : '#fff', position : 'absolute', top : '10px', right : '10px', textAlign : 'center'}}
        onClick={(e)=>{e.stopPropagation();
            let boolean = window.confirm('이미지를 삭제하시겠어요?')
            if(boolean){
                e.target.parentNode.style.transition = 'opacity 1s'
                e.target.parentNode.style.opacity = 0
                setTimeout(()=>{
                e.target.parentNode.style.transition = 'none'
                e.target.parentNode.style.opacity = 1

                    DeleteImg(i); 
                    console.log(i,'번째이미지 삭제')
                },1000)
            }

        }}
        >X</button>
        
        </div>
    )
}