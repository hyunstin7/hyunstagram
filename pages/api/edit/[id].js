import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";


export default async function Handler(req,res){
    let db = (await connectDB).db('4rum')
    let result = await db.collection('post').findOne({_id : new ObjectId(req.query)})
    let { content, user } = req.body
    
    try {
        if(req.method == 'POST'){
            if(user.email == result.author){
                console.log('수정완료')
                content = content.replace(/(?:\r\n|\r|\n)/g, '<br>')
               
                await db.collection('post').updateOne({ _id : new ObjectId(req.query)},{$set : { content,}})
                return res.status(200).json({root : '/'})}
            }else{
                return res.status(400).send('잘못된 접근 방식입니다')
            }
    } catch (error) {
        console.error(error); // 서버 로그에 에러 기록
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
    
}