import { connectDB } from "@/util/database"
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import getUserInfo from "@/util/getuserinfo";

export default async function Handler(req,res){
    let user = req.body.user
    let info = {}

    try {
        if(req.method == 'POST') {
            if(user){
             if (req.body.content == ''){
                 res.status(403)
             }
             else{
             console.log('작성완료')
                 await req.body;
                 info.images = req.body.images
                 info.correction = req.body.correction
                 info.filter = req.body.filter
                 info.pos = req.body.pos
                 info.content = req.body.content.replace(/(?:\r\n|\r|\n)/g, '<br>')
                 info.author = user.email
                 info.likes = []
                 info.Date = new Date()
                 let db = (await connectDB).db('4rum')
                 await db.collection('post').insertOne(info)
                 return await res.status(200).json('/')    
             }
             
            }else{
             return res.status(400).json('로그인해주세요')
            }
         }
    } catch (error) {
        console.error(error); // 서버 로그에 에러 기록
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}