'use client'
import jwt from 'jsonwebtoken';

export default async function getUserInfo() {
    try {
      // JWT 토큰 디코딩
      const decoded = await jwt.decode(sessionStorage.getItem('token'));
      console.log()
      const res = await fetch('/api/userinfo',{
        method : 'POST',
        body : JSON.stringify({email : decoded.email}),
        headers : {'Content-Type' : 'application/json'} 
    })
    const userinfo = await res.json()
      return userinfo;
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  }