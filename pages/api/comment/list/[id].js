import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function Handler(req, res) {
    try {
        if (req.method == 'GET') {
            let db = (await connectDB).db('4rum')
            let result = await db.collection('comment').find({ parent: new ObjectId(req.query) }).toArray()
            await res.status(200).json(result)

        }
    } catch (error) {
        console.error(error); // 서버 로그에 에러 기록
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}