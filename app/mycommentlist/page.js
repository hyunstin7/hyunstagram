'use client'

import { useEffect, useState } from "react"

export default function MyCommentList({ a }) {
    const [writer, setWriter] = useState(null)
    const getInfo = async () => {
        const res = await fetch('/api/userinfo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: a.author })
        })
        if (res.ok) {
            const writer = await res.json()
        
            setWriter(writer)
        }
    }
    useEffect(() => {
        getInfo()
    },[])
    return (
        <div className="comment-list" style={{ padding: '5px 0px' }}>
            {
                writer &&
                <div className="comment" style={{ color: "#fff", display: 'flex', justifyContent: 'space-between' }}>
                    <div className="comment-content" style={{ display: 'flex', alignItems: 'center' }}>
                        <h4 style={{ fontSize: '12px', marginRight: '10px' }}>{writer.name}</h4>
                        <p style={{ color: '#fff', margin: 0, lineHeight: '0.95', wordBreak: 'break-word', fontSize: '12px' }}>{a.comment}</p>
                    </div>
                </div>
            }
        </div>
    )
}