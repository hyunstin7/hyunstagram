'use client'
import MyBoardHeader from "./myboardheader/page";
import ListItem from "../listitem/page";

export default function MyBoard({user,board,ReceiveOpenBorad}) {
    const session = {}
    session.user = user
  return (
    <div className="move-rl" style={{ position: 'fixed', top:0, left:0, width:'100%', background : '#000',zIndex:999, height:'100vh', overflow : 'scroll'}}> 
        <MyBoardHeader user={user} ReceiveOpenBorad={ReceiveOpenBorad}/>   
      <div className="list-bg">
        {board.map((a, i) => (
          <ListItem a={a} session={session} i={i} key={i} />
        ))}
      </div>
    </div>
  );
}
