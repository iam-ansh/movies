'use client'
import { signOut } from "next-auth/react"

export default function Dashboard(){
    return(
        <>
        <h1>Dashboard</h1>
        <button onClick={() => {
            signOut({callbackUrl : '/signin'})
        }}>logout</button>
        </>
    )
}