import { connectDB } from "@/util/database"
import SearchBar from "./searchbar/page"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"


export default async function UserSearch(){
    const email = (await getServerSession(authOptions)).user.email
    const db = (await connectDB).db('user')
    const users = await db.collection('userinfo').find().toArray()
    const myinfo = await db.collection('userinfo').findOne({email,})
    return(
        <div>
           <SearchBar users={users} myinfo={myinfo}/>
        </div>
    )
}