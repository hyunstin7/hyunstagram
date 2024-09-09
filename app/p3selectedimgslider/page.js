'use client'

import { useEffect, useState } from "react"

export default function P3SelectedImgSlider({
    a,
    i,
    filter,
    ReceiveFilterNum,
    ReceiveOpenFilter,
    pos,
    ChangeCurrentFilter,
    ChangeFilterBtn,
    correctArr,
    selectedFiles
}){

    useEffect(()=>{
        if(selectedFiles.length == 1){
            document.querySelector('.p3-seleted-img-slide').style.justifyContent = 'center'
        
        }else{
            document.querySelector('.p3-seleted-img-slide').style.justifyContent = 'flex-start'
        }
    },[selectedFiles])
    return(
        <div className={"p3-selected-img-slider p3-selected-img-slider" + i} 
        style={{ flex : '0 0 calc(50vw - 10px)', position : 'relative', transition : 'opacity 1s', height :'calc(50vw - 10px)', borderRadius : '6px', overflow : 'hidden', margin : '0 3px' }}
       >
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
            src={a.preview} alt={`Preview ${i}`} style={{ width: 'calc(50vw - 10px)', position:'absolute' , left:0, transform:'translate3d(0,-50%,0)', top : `${pos[i]*(window.innerWidth*0.5 - 10)/(window.innerWidth - 80)}px`}}
             />
        </div>
        </div>
        
        
        </div>
    )
}