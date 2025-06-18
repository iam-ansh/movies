'use client'
import { useState } from "react"
import { signIn } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";

export default function SigninPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const submitHandler = async (e : React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await signIn("credentials", {
                email : email,
                password : password,
                redirect : false
            })
            if(!res?.ok){
                toast("signIn failed");
                return;
            }
            toast("Signed In successfully")
            setTimeout(() => router.push('/dashboard'), 3000);

        } catch (error : unknown) {
            console.log("error in signin page: ", error)
            return;
        }
    }
    // const signinWithGoogle = async() => {
    //     const success = signIn("google")
    // }
    return(
        <>
        <form>
        <input type="email" placeholder="email" 
        value={email} 
        onChange={(e) => {
            setEmail(e.target.value);
        }}
        />
        <input type="text" placeholder="password" 
         value={password} 
        onChange={(e) => {
            setPassword(e.target.value);
        }}
        />
        <button type="submit" onClick={submitHandler}>Submit</button>
        </form>
        <button onClick={() => signIn("google", {callbackUrl : '/dashboard'})}>sign in with google</button>
        <ToastContainer/>
        </>
    )
}