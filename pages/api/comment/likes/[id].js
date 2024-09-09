import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Handler(req,res){
    
    try {
        if(req.method == 'POST'){
            let db = (await connectDB).db('4rum')
            await req.body
            req.body = JSON.parse(req.body)
            console.log('좋아요목록',req.body)
            await db.collection('comment').updateOne({ _id : new ObjectId(req.query)},{$set : {likes  : req.body}})
            return res.status(200).json()
        }
    } catch (error) {
        console.error(error); // 서버 로그에 에러 기록
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}