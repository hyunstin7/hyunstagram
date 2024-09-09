import { connectDB } from "@/util/database"

export default async function Handler (req,res) {

    const {followingEmail,followerEmail} =  req.body

    const db = (await connectDB).db('user')
    const User = await db.collection('userinfo').findOne({ email : followingEmail,})
    try{
        if(req.method == 'POST'){
            if(!User.following.includes(followerEmail)){
                await db.collection('userinfo').updateOne({email : followingEmail },{$push : {following : followerEmail,}})
                await db.collection('userinfo').updateOne({email : followerEmail },{$push : {follower : followingEmail,}})
            }
            res.status(200).json('팔로우완료')
            }
        if(req.method == 'DELETE'){
            await db.collection('userinfo').updateOne({email : followingEmail },{$push : {following : followerEmail,}})
            await db.collection('userinfo').updateOne({email : followerEmail },{$push : {follower : followingEmail,}})
            res.status(200).json('팔로우완료')
        }
    }
    catch(error){
        res.status(500).json(error)
    }
}