'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import RegisterImg from './registerimg/page';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  params: { Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME },
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});


export default function Register() {

  let router = useRouter()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [image, setImage] = useState("https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/profileimg.png");
  const [currentImage, setCurrentImage] = useState("https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/profileimg.png");
  const [processNum, setProcessNum ] = useState(0)
  const [name, setName ] = useState('')
  const [error, setError] = useState('')
  const [selectedFile,setSelectedFile] = useState({})
  const [openRegisterImg,setOpenRegisterImg] = useState(false)
  const [key, setKey] = useState('profileimg.png')

  useEffect(()=>{
    if(processNum < 0) {
      router.push('/')
    }
  },[processNum])

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

 

  const getContentType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        default:
            return 'application/octet-stream'; // Default fallback for unsupported types
    }
};
  const ReceiveOpenRegisterImg = (e) => {
    setOpenRegisterImg(e)
  }

  const handleSubmit = async (e) => {
    try {
      const uploadedFileKey = await Promise.all(
          [selectedFile].map(async (file) => {
            const params = {
              Body: file,
              Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
              Key: `hyunstagram/${name}/${file.name}`,
              ContentType: getContentType(file.name),
            };
        
            // AWS SDK v3 사용 시
            await s3.putObject(params).promise();
        
            return `${name}/${file.name}`; // Promise의 반환값
          })
        );
         
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, image : key, name, }),
        });
    
        const result = await res.json();
        if(result.message !== '회원가입을 축하드린다능'){setError(result.message)}else{
          setProcessNum(result.num)
        }
        
  } catch (error) {
      console.error('Error uploading images:', error);
  }

    

    
  };

  const ReceiveImage = (e) => {
    setImage(e)
    setCurrentImage(e)
  }
  const handleFileChange = useCallback((e) => {
    const newFile = e.target.files[0]
        newFile.preview = URL.createObjectURL(newFile);  // 미리보기 URL 생성
        console.log(newFile)
    setSelectedFile(newFile);  // 파일 상태 업데이트
    setOpenRegisterImg(true)
    setImage(newFile.preview)
    },[]);
  

  const CheckEmail =  async () => {
    let email = await document.querySelector('.register-email').value;
    console.log(email)
    const res =await fetch('/api/checkemail', {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body : JSON.stringify({email,})
    });

    const result = await res.json() 
    if(result.message == ''){setProcessNum(1);setError(result.message)}
    else{setError(result.message);}
  
  }
  return (
    <div style={{ display : 'flex', width : '100%', overflow : 'hidden', height : '100vh', position : 'relative'}}>
      {
        openRegisterImg && 
        <RegisterImg 
        ReceiveOpenRegisterImg={ReceiveOpenRegisterImg} 
        selectedFile={selectedFile} 
        ReceiveImage={ReceiveImage}
        currentImage={currentImage}
        />
      }
     <div style={{ transform : `translate3d(${-processNum * 100}vw,0,0)`, display : 'flex', position: 'absolute', top:0, left:0, width: '400%', transition : 'transform 0.2s ease-out'}}>
      <div className='move-rl' style={{ display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', position : 'relative'}}>
<button tabIndex={-1} onClick={()=>{ setProcessNum(processNum-1)}} style={{ position : 'absolute', top : '20px', left :'20px'}}>뒤로가기</button>

        <div className='process-tab process-tab1' style={{ height : '120px'}}>
      <h4 onClick={()=>{console.log(222)}}>ID 등록</h4>
      <input tabIndex={-1}
      className='register-email'
        type="email"
        placeholder="이메일을 입력하세요"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value); 
          if(e.target.value){
            if(!validateEmail(e.target.value)){setError('올바른 이메일 형식이 아닙니다'); document.querySelector('.regi-btn1').classList.remove('changebutton')}
          else{setError(''); document.querySelector('.regi-btn1').classList.add('changebutton')}
          }else{
            setError('');
          }
        }}
        required
        style={{ width : '80vw'}}
      />
      <p style={{ color : '#cfcece', marginBottom : '5px'}}>{error}</p>
      <p className='regi-btn1' style={{ padding : '10px 20px', background : '#aaa', borderRadius : '5px', pointerEvents : 'none',}}
      onClick={(e)=>{
          CheckEmail()
      }}
      >다음</p>    

      </div>
      </div>
      
     
      <div className='move-rl' style={{ display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', position : 'relative'}}>
<button tabIndex={-1} onClick={()=>{ setProcessNum(processNum-1)}} style={{ position : 'absolute', top : '20px', left :'20px'}}>뒤로가기</button>

      <div className='process-tab process-tab2'style={{ height : '200px'}}>
      <h4>비밀번호 등록</h4>
      <input tabIndex={processNum !== 1 && -1 }
        className='password1'
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => {
          setError('')
          setPassword(e.target.value)
          if(e.target.value){
            if(document.querySelector('.password2').value){
              document.querySelector('.regi-btn2').classList.add('changebutton')
            }
          }else{
            document.querySelector('.regi-btn2').classList.remove('changebutton')
          }
        }}
        required
      />
      <input tabIndex={processNum !== 1 && -1 }
        className='password2'
        type="password"
        placeholder="비밀번호를 재입력하세요"
        value={password2}
        onChange={(e) => {
          setPassword2(e.target.value)
          if(e.target.value){
            setError('')
            if(document.querySelector('.password1').value){
              document.querySelector('.regi-btn2').classList.add('changebutton')
            }
          }else{
            document.querySelector('.regi-btn2').classList.remove('changebutton')
          }
        }}
        required
      />
      <p style={{ color : '#cfcece', marginBottom : '5px'}}>{error}</p>
      <button tabIndex={-1} className='regi-btn2'
      style={{ padding : '10px 20px', background : '#aaa', borderRadius : '5px', pointerEvents : 'none',}}
      onClick={()=>{password === password2 ? setProcessNum(2) : setError('비밀번호가 일치하지 않습니다')}}>다음</button>
      </div>
      </div>
      
      
      
     
        <div className='move-rl' style={{ display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', position : 'relative'}}>
<button tabIndex={-1} onClick={()=>{ setProcessNum(processNum-1)}} style={{ position : 'absolute', top : '20px', left :'20px'}}>뒤로가기</button>

        <div className='process-tab process-tab3' style={{ height : 'auto'}}>
      <div style={{ position : 'relative', borderRadius : '50%', overflow : 'hidden', width : '70px', height : '70px', background : '#e3e3e3',display : 'flex', justifyContent : 'center', alignItems :'center'}}>
      <img src={image} style={{ width: '70px', height: '70px', borderRadius : '50%', overflow:'hidden' }}></img>
      
      </div>
      <label className="custom-file-input" style={{}}>
          <input tabIndex={-1}
            type="file"
            name="image"
            accept='image/*'
            onChange={handleFileChange}
            className="select-img"
            style={{ display: 'none' }}
          />
        프로필 이미지 추가하기</label>
                
      <input tabIndex={-1}
        type="text"
        name="name"
        placeholder="닉네임을 적으세요"
        required
        value={name.toLowerCase()}
        onChange={(e) => {
          setName(e.currentTarget.value)
          if(e.currentTarget.value=='') {
            document.querySelector('.regi-btn3').classList.remove('changebutton')
            }else{
              if(!/^[a-z0-9_.]+$/.test(e.currentTarget.value)){
                setError('특수문자는 사용 할 수 없습니다')
                document.querySelector('.regi-btn3').classList.remove('changebutton')
              }else{
                setError('')
                document.querySelector('.regi-btn3').classList.add('changebutton')
              }
            }
            setKey(`${e.currentTarget.value}/${selectedFile.name}`)
        }}
      />
      {
       <p style={{ color : '#cfcece', margin:'15px 0'}}>{error}</p>
      }
      <button tabIndex={-1} className='regi-btn3' onClick={()=>{handleSubmit();}} 
      style={{ background : '#d2ddd6', color : '#000', fontWeight : 'bold', pointerEvents : 'none', padding:'10px 20px'}}>회원가입신청하기</button>
      </div>
      </div>
      <div className='move-rl' style={{ display : 'flex', justifyContent : 'center', alignItems : 'center', width : '100%', position : 'relative', flexDirection :'column'}}>

     
      <h4>회원가입을 축하드립니다</h4>
      <Link tabIndex={-1} href='/login'  style={{ background : '#d2ddd6', color : '#000', fontWeight : 'bold', padding : '10px 20px', borderRadius : '10px', marginTop : '50px'}}>로그인하러하기</Link>
    
      
      </div>
      
      
      </div>
    </div>
  );
}
