
'use client'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import getUserInfo from '@/util/getuserinfo';
import { signIn } from 'next-auth/react';


export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('')

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    

    if (navbar) {
        navbar.style.display = 'none';
    }

    return () => {
        if (navbar) {
            navbar.style.display = 'flex';
        }
    };
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result.error) {
      setMessage(result.error);
    } else {
      window.location.href = '/'
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100vh', justifyContent: 'center', width: '100%', flexDirection: 'column', background : '#fff' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height : '250px' }}>
        <h4 style={{ fontSize: '35px', marginBottom : '20px', color :'#2e2e2e'}}>Hyunstagram</h4>
  
        <input
            type="email"
            placeholder="전화번호 또는 이메일"
            value={email}
            onChange={(e) => {setEmail(e.target.value); setMessage('')}}
            required
            style={{ width: '250px' }}></input>

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => {setPassword(e.target.value); setMessage('')}}
            required
            style={{ width: '250px' }}></input>
            <p style={{ color :'red',marginBottom : '30px'}}>{message}</p>
 
        <button type="submit" style={{  width : '250px', padding : '10px 5px', borderRadius : '10px'}}>로그인</button>
      </form>
      <div className='ddon' style={{ display: 'flex', justifyContent : 'center', alignItems : 'center', color : '#808080', marginBottom : '30px'}}><span> </span> <p style={{ margin : '0 5px'}}>또는</p> <span> </span></div>

      <Link href='/register' style={{ color : '#496999', fontWeight : 'bold', marginBottom : '30px'}}>비밀번호를 잊으셨나요?</Link>
      <p style={{ color : '#000'}}>계정이 없으신가요 ? <Link href='/register' style={{ color : '#3973c9', fontWeight : 'bold'}}>가입하기</Link></p>
    </div>
  );
}
