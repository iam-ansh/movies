'use client'
import { signIn } from "next-auth/react";
import { useState } from "react"
import { toast , ToastContainer } from 'react-toastify'

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        const signupData = {
            email: email,
            username: username,
            displayName: displayName,
            password: password
        }
        try {
            const res = await fetch('/api/authentication', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(signupData)
            })
            if(!res.ok){
                toast("sign up failed")
                return;
            }
            const response = await res.json();
            toast(response.message);

        } catch (error: unknown) {
            console.log("error in signup page: ", error);
            return;
        }
    }
    return (
        <>
            <form>
                <input type="email" placeholder="email" 
                value={email} onChange={(e) => {
                    setEmail(e.target.value);
                }} />
                <input type="text" placeholder="username" 
                value={username} onChange={(e) => {
                    setUsername(e.target.value);
                }} />
                <input type="text" placeholder="displayName" 
                value={displayName} onChange={(e) => {
                    setDisplayName(e.target.value);
                }} />
                <input type="text" placeholder="password" 
                value={password} onChange={(e) => {
                    setPassword(e.target.value);
                }} />
                <button type="submit" onClick={submitHandler}>Submit</button>
            </form>
            <button onClick={() => signIn("google", {callbackUrl : '/dashboard'})}>sign up with google</button>
            <ToastContainer/>
        </>
    )
}