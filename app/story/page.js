'use client'
import { useEffect, useState } from "react"

export default function Story({session}){
    const [storyOn,setStoryOn] = useState(null)
    const [loading,setLoading] = useState(true)
    
    
    const mountHandler = async () => {
        try{
            const res = await fetch('/api/story/list')
            const result = await res.json()
            await setStoryOn(result)
        }catch(error){
            console.log("에러발생",error)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        mountHandler()
        let lastScroll = 0;
        document.querySelector('.home').addEventListener('scroll',(e)=>{
            const scrollY = e.currentTarget.scrollTop
            if(scrollY > lastScroll){
                document.querySelector('.main-header').style.transform = 'translate3d(0,-100%,0)'
            }else if(scrollY == 0){
                document.querySelector('.main-header').style.transform = 'translate3d(0,0,0)'
            }else{
                document.querySelector('.main-header').style.transform = 'translate3d(0,0,0)'
            lastScroll = scrollY
            }
            lastScroll = scrollY
        })

    },[])

   

    if(!loading){
        return(
            <div style={{ display : 'flex'}}>
               {
                    storyOn.map((a,i)=>
                        <div key={i} style={{margin : '0 5px', display : 'flex', width : 'max-content',flexDirection : 'column', justifyContent : 'center', alignItems : 'center'}}>
                    <div style={{display: 'flex', justifyContent : 'center', alignItems: 'center', background : 'linear-gradient(45deg,  #F58529,  #DD2A7B, #8134AF, #515BD4 )',borderRadius : '50%', padding : '4px'}}>
                    <div style={{display: 'flex', justifyContent : 'center', alignItems: 'center',padding : '5px', background : '#000',borderRadius : '50%'}}>
                    <div style={{ borderRadius : '50%', width : 'auto', height: 'auto',overflow : 'hidden'}}>
                    <img src={a.image} style={{ width : '50px', height: '50px'}}></img>
                    </div>
                    </div>
                    </div>
                    <span style={{ fontSize : '12px'}}>{a.name}</span>
                    </div>
                    )
                }
                
            </div>
        )
    }else{
        return(null)
    }
}