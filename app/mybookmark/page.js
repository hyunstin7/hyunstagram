'use client'


import ListItem from "../listitem/page";
import MyBookmarkHeader from "./mybookmarkheader/page";

export default function MyBookmark({user,bookmark,ReceiveOpenBookmark}) {
    const session = {}
    session.user = user
  return (
    <div className="move-rl" style={{ position: 'fixed', top:0, left:0, width:'100%', background : '#000',zIndex:9999, overflow : 'scroll', height: '100vh'}}> 
        <MyBookmarkHeader user={user} ReceiveOpenBookmark={ReceiveOpenBookmark}/>   
      <div className="list-bg">
        {bookmark.map((a, i) => (
          <ListItem a={a} session={session} i={i} key={i} />
        ))}
      </div>
    </div>
  );
}
