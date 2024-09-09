import { connectDB } from "@/util/database"


export default async function Handler(req,res){
    try{
        if(req.method == 'POST'){
            const {email} = req.body
            const db = (await connectDB).db('user')
            const userinfo = await db.collection('userinfo').findOne({email,})
            return res.status(200).json(userinfo)

        }
    }catch(error){
        return res.status(400).json({massege : error})
    }
    
}