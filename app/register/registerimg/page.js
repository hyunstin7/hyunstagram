'use client'

export default function RegisterImg({selectedFile,ReceiveOpenRegisterImg,ReceiveImage,currentImage}){

    return(
        <div style={{position:'fixed',width:'100%',height:'100vh',background:'#000',top:0,left:0,zIndex:888888}}>
            <div style={{ padding: '10px 20px', position: 'relative', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src="https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/back.png" style={{ width: '25px' }}
                    onClick={() => { ReceiveOpenRegisterImg(false); ReceiveImage(currentImage)}}
                ></img>
                <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate3d(-50%,-50%,0)' }}>내 프로필 사진</p>
                <h4 onClick={()=> { ReceiveOpenRegisterImg(false); ReceiveImage(selectedFile.preview);}} style={{color:'#3973c9'}}>완료</h4>
            </div>
            <div className="img-wrap" style={{ width: 'calc(100vw - 80px)', maxWidth: '768px', maxHeight: '768px', height: 'calc(100vw - 80px)', margin: '20px 40px',position: 'absolute', overflow: 'hidden', background:'#000' }} >
            <img draggable="true" src={selectedFile.preview} alt={`Preview`} style={{ position: 'absolute', zIndex: 1, width: '100%', top: `50%`, transform: 'translate3d(0,-50%,0)',opacity:0.4 }}
              

            />
            <div className="img-wrap" style={{ width: 'calc(100vw - 80px)', maxWidth: '768px', maxHeight: '768px', height: 'calc(100vw - 80px)', position: 'absolute', zIndex: 1, borderRadius:'50%', overflow: 'hidden', background:'#000' }} >
            <img draggable="true" src={selectedFile.preview} alt={`Preview`} style={{ position: 'absolute', width: '100%', top: `50%`, transform: 'translate3d(0,-50%,0)'}}
               

            />

            </div>
        </div>
        </div>
    )
}