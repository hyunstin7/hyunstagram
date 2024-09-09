import { connectDB } from "@/util/database"
import { ObjectId } from "mongodb"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

export default async function Handler(req,res){
    const session = (await getServerSession(req,res,authOptions))
    let user;
    session ? user = session.user : user = null
    
    console.log(user)
    try{
        if(req.method == 'GET'){
            const { id } = await req.query
            const db = (await connectDB).db('4rum')
            const a = await db.collection('post').findOne({ _id: ObjectId(id) });
            return res.status(200).json({a,user,})
        }

    }catch(error){

    }
}