'use client'

import { signOut } from "next-auth/react"


export default function LogOutBtn(){

    const handleLogout = async () => {
        try {
            await signOut({ redirect: false })
            window.location.href = '/login'
        } catch (error) {
            console.error("Logout error:", error)
        }
    }

    return(
        <button onClick={handleLogout}>로그아웃</button>
    )
}