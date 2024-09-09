import { connectDB } from "@/util/database";

export default async function Handler(req,res) {
    const {email} = req.body
    const db = (await connectDB).db('4rum')
    const board = await db.collection('post').find({author : email}).toArray()
    try{
        if(req.method = 'POST'){
            return res.status(200).json(board)
        }
    }catch(error){
        return res.status(500).json({message : error})
    }
    
    
}