import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import { connectDB } from "@/util/database"

export default async function Handler(req,res) {
    const current = req.body.current
    const email = (await getServerSession(req,res,authOptions)).user.email
    const db = (await connectDB).db('user')
    try{
        const userinfo = await db.collection('userinfo').findOne({email,})
        if(req.method === 'POST'){
            if(!userinfo.currentSearch.includes(current)){
                await db.collection('userinfo').updateOne({ email, }, { $push: { currentSearch : current } });
                const user = await db.collection('userinfo').findOne({email,})
                const currentSearch = user.currentSearch
                return res.status(200).json(currentSearch)
            }else{
                await db.collection('userinfo').updateOne({ email, }, { $pull: { currentSearch : current } });
                await db.collection('userinfo').updateOne({ email, }, { $push: { currentSearch : current } });
                const user = await db.collection('userinfo').findOne({email,})
                const currentSearch = user.currentSearch
                return res.status(200).json(currentSearch)
            }
        }
        if(req.method === 'DELETE'){
                await db.collection('userinfo').updateOne({ email, }, { $pull: { currentSearch : current } });
                const user = await db.collection('userinfo').findOne({email,})
                const currentSearch = user.currentSearch
                return res.status(200).json(currentSearch)
        }
    }catch(error){
        console.log('에러이유',error)
        return res.status(500).json(error)
    }
}