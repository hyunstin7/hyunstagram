// app/page.tsx (또는 app/home/page.tsx 등)
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { connectDB } from "@/util/database";
import ListItem from "./listitem/page";
import Story from "./story/page";
import LogOutBtn from "./Logoutbtn";
import { redirect } from "next/navigation";
import Link from "next/link";




export default async function Home() {
  const session = {}
  const sessioncookie = await getServerSession(authOptions);
  if(!sessioncookie){
    redirect('/login')
  }
  const db = (await connectDB).db('user');
  const data = await db.collection('userinfo').findOne({email : sessioncookie.user.email})
  console.log(data)
 

  let user;
  if(sessioncookie){
   data._id = data._id.toString()
   user = data
  }else{
    user = null
  }
  session.user = user

  const db2 = (await connectDB).db('4rum');
  const list = await db2.collection('post').find().toArray();
 
  


  return (
    <div className="home" style={{height : 'calc(100vh - 55px)', overflowY : 'scroll', scrollBehavior :'smooth'}}>
      <div className="main-header" style={{ display: 'flex', transition:'transform .3s',background: '#000',width: '100%', justifyContent: 'space-between', alignItems: 'center', paddingRight: '10px', position:'fixed',top:0,left:0, zIndex: '99' }}>
        <p className="logo" style={{  padding: '15px' }}>
          Hyunstagram
        </p>
       
      </div>
      <div className={'story-wrap'} style={{ display: 'flex', overflowX: 'scroll', marginTop:'50px' }}>
        {session ? session.user.story.length > 0 ?
          <div style={{ margin: '0 5px', display: 'flex', width: 'max-content', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(45deg,  #F58529,  #DD2A7B, #8134AF, #515BD4 )', borderRadius: '50%', padding: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px', background: '#000', borderRadius: '50%' }}>
                <div style={{ borderRadius: '50%', width: 'auto', height: 'auto', overflow: 'hidden' }}>
                  <img src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + session.user.image} style={{ width: '50px', height: '50px' }} />
                </div>
              </div>
            </div>
            <span style={{ fontSize: '12px' }}>내 스토리</span>
          </div>
          :
          <div style={{ margin: '0 5px', display: 'flex', width: 'max-content', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3px', background: '#4d4d4d', borderRadius: '50%', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2px', background: '#000', borderRadius: '50%' }}>
                <div style={{ borderRadius: '50%', width: 'auto', height: 'auto', overflow: 'hidden' }}>
                  <img src={'https://hyunstagram.s3.ap-northeast-2.amazonaws.com/hyunstagram/' + session.user.image} style={{ width: '50px', height: '50px' }} />
                </div>
              </div>
            </div>
            <span style={{ fontSize: '12px' }}>내 스토리</span>
          </div>
          : null
        }
        {session && <Story session={session} />}
      </div>
      <div className="list-bg">
        {list.reverse().map((a, i) => (
          <ListItem a={a} session={session} i={i} key={i} />
        ))}
      </div>
      
    </div>
  );
}
