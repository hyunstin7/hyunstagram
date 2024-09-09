import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function Handler(req,res){
    const user = (await getServerSession(req,res,authOptions)).user
    
    try {
        if(req.method == 'POST'){
            let db = (await connectDB).db('4rum')
            let {comment} = req.body
            if(user){
                await db.collection('subcomment').insertOne({ 
                    comment, 
                    likes : [],
                    author: user.email, 
                    parent: new ObjectId(req.query), 
                    Date: new Date()
                     })
                let result = await db.collection('subcomment').find({ parent: new ObjectId(req.query) }).toArray()
                return res.status(200).json(result)
            }else{
                return res.status(200).json('')
            }
            
        }
    } catch (error) {
        console.error(error); // 서버 로그에 에러 기록
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    
    
}