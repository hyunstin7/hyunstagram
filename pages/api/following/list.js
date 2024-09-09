import { connectDB } from "@/util/database";

export default async function Handler(req,res){
    const { following } = req.body;
    const db = (await connectDB).db('user')
    try{
        if(req.method == 'POST'){
            const list = await db.collection('userinfo').find({ email: { $in: following } }).toArray()
            return res.status(200).json(list)
        }
    }catch(error){
        return res.statue(500).json(error)
    }
}