
import { connectDB } from "@/util/database"
import ProfileHeader from "../profileheader/page"
import ProfileInfo from "../profileinfo/page"
import ProfileSetting from "../profilesetting/page"
import ProfileTab from "../profiletab/page"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

  
export default async function Profile(props){
    const session = await getServerSession(authOptions)
    const db = (await connectDB).db('user')
    const user = await db.collection('userinfo').findOne({name : props.params.id})
    return(
        <div style={{width:'100%', height:'100vh', overflowY:'scroll'}}>
            <ProfileHeader user={user} session={session}/>
            <ProfileInfo user={user} session={session}/>
            <ProfileSetting user={user} session={session}/>
            <ProfileTab user={user} session={session}/>
        </div>
    )
}
