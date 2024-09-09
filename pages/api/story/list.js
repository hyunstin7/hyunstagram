import { connectDB } from "@/util/database"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"

export default async function Handler(req,res){
    const session = await getServerSession(req,res,authOptions)

    
    try{
        if(req.method == 'GET'){
           
            const storyOn = [] 
            const db = (await connectDB).db('user')
            const userInfo = await db.collection('userinfo')
            const myInfo = await userInfo.findOne({email : session.user.email})
            const myFollowing = await myInfo.following
            const myFollower = await myInfo.follower
            const userArr = await [...myFollowing, ...myFollower]
            
            const storyArr = await userInfo.find({ email: { $in: userArr } }).toArray()
          
            storyArr.map(async(a)=>{
                if(a.story.length > 0){
                    await storyOn.push(a)
                }
            })
            const storyOnResult = storyOn.sort((a,b)=>a.date-b.date)
            return res.status(200).json(storyOnResult)
        }
    }catch(error){
        return res.status(500).json("error : ",error)
    }
   
}


