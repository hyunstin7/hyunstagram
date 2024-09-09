


import { connectDB } from '@/util/database';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, image, name } = req.body;


    let db = (await connectDB).db('user');
    let users = db.collection('users');
    let usersinfo = db.collection('userinfo');


    // 이메일 중복 확인
    const existingUser = await usersinfo.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: '이미 사용중인 닉네임입니다' });
    }else{
 // 비밀번호 해싱
 const hashedPassword = await bcrypt.hash(password, 10);

 // 사용자 생성
 const user = { email, password: hashedPassword, createdAt: new Date() };
 const userinfo = { email,  createdAt: new Date() , image , name, follower : [], following : [], bookmark : [], story : [], intro :{content : '', height : '37px'}, currentSearch : [], realName : '', reels: [] };
 await users.insertOne(user);
 await usersinfo.insertOne(userinfo);

 res.status(201).json({ message: '회원가입을 축하드린다능' , root : '/login', num : 3});
    }

   
  } else {
    res.status(405).json({ message: '잘못된 접근 방식입니다' });
  }
}
