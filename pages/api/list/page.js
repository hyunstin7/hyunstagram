import { connectDB } from "@/util/database";

export default async function Handler(req,res){
    try{
        if(req.method == 'GET'){
            const db = (await connectDB).db('4rum')
            const list = await db.collection('post').find().toArray();
            return res.status(200).json(list)
        }
    }catch(error){
        return res.status(400).json()
    }
}