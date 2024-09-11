import { connectDB } from "@/util/database";

export default async function List(req,res){
    let db = (await connectDB).db('4rum')
    
    try {
        const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  

  // 최신순으로 데이터 가져오기
  const list = await await db.collection('post')
    .find({})
    .sort({ Date : -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .toArray();

  res.status(200).json(list);
    } catch (error) {
        console.error(error); // 서버 로그에 에러 기록
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
}
