import { connectDB } from "@/util/database";

export default async function List(req,res){
    let db = (await connectDB).db('4rum')
    let result = await db.collection('post').find().toArray();
    
    try {
        return res.status(200).json(result)
    } catch (error) {
        console.error(error); // 서버 로그에 에러 기록
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}
