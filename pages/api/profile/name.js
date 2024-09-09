import { connectDB } from "@/util/database"

export default async function Handler(req,res){
    const {name , email} = req.body
    const db = (await connectDB).db('user')
    try{
        if(req.method == 'POST'){
            const username = await db.collection('userinfo').findOne({name,})
            
            if(!username){
            await db.collection('userinfo').updateOne({email,},{$set : {name,}})
            return res.status(200).json({message : '변경 성공'})
            }else{
            return res.status(400).json({message : '이미 존재하는 이름 입니다'})
            }
        }

    }catch(error){
        console.log("에러이유 : ",error)
        return res.status(500).json({ message : error})
    }
}