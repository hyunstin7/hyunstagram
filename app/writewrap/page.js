import { getServerSession } from "next-auth";
import Write from "../write/page"
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/database";

export default async function WriteWrap() {
    const session = {}
  const sessioncookie = await getServerSession(authOptions)

  if(!sessioncookie){
    redirect('/login')
  }

  const db = (await connectDB).db('user');
  const user = await db.collection('userinfo').findOne({email : sessioncookie.user.email})
  session.user = user
  console.log(session,user,'세션유저임')
    return(
        <div>
            <Write user={user}/>
        </div>
    )
}