import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/util/database';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const authOptions = {
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          let db = (await connectDB).db('user');
          let collection = db.collection('users');
          
          // 사용자 조회
          const user = await collection.findOne({ email: credentials.email });
          const userinfo = await db.collection('userinfo').findOne({ email: credentials.email });
          if (!user) {
            throw new Error('이메일 혹은 비밀번호가 틀렸습니다');
          }

          // 비밀번호 확인
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            throw new Error('이메일 혹은 비밀번호가 틀렸습니다');
          }

          // JWT 토큰 발급
          const token = jwt.sign(
            { email: userinfo.email },
            process.env.JWT_SECRET,
            { expiresIn: '180d' }
          );

          // 인증된 사용자 반환
          return {
            ...userinfo,
            token,
          };
        } catch (error) {
          console.log('에러사유 : ', error);
          throw new Error('인증 중 오류가 발생했습니다');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.follower = user.follower;
        token.following = user.following;
        token.bookmark = user.bookmark;
        token.story = user.story;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          email: token.email,
          name: token.name,
          image: token.image,
          follower: token.follower,
          following: token.following,
          bookmark: token.bookmark,
          story: token.story
        };
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
