import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";



export default async function Hadler(req, res) {
    const user = (await getServerSession(req,res,authOptions)).user
    const {author} = req.body
    try {
        if (req.method == 'DELETE') {
            let db = (await connectDB).db('4rum')
            if (author == user.email) {
                console.log('삭제완료')
                await db.collection('post').deleteOne({ _id: new ObjectId(req.query) })
                let subfind = await db.collection('comment').find({ parent: new ObjectId(req.query) }).toArray()
                console.log(subfind)
                subfind.forEach(async (a, i) => {
                    await db.collection('subcomment').deleteMany({ parent: new ObjectId(a._id) })

                })
                await db.collection('comment').deleteMany({ parent: new ObjectId(req.query) })
                return res.redirect('/write')
            } else {
                console.log('삭제안됨')
                return res.status(400).json('잘못된 접근 방식입니다')
            }

        }
    } catch (error) {
        console.error(error,'에러이유는?'); // 서버 로그에 에러 기록
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }

}