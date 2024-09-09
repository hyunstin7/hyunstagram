import { connectDB } from "@/util/database"

export default async function Handler(req,res){
    const {realName , intro, height, email} = req.body
    const db = (await connectDB).db('user')
    try{
        if(req.method == 'POST'){
            await db.collection('userinfo').updateMany({email,},{$set : {realName, intro : {content:intro,height,}}})
        }
    }catch(error){
        console.log("에러이유 : ",error)
        return res.status(500).json({ message : error})
    }
}