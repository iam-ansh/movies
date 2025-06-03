import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const handler =  NextAuth({
    providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: " email",
    // `credentials` is used to generate a form on the sign in page.
    // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    // e.g. domain, username, password, }2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      email: { label: "Email", type: "text", placeholder: "enter your email here" },
      password: { label: "Password", type: "password", placeholder: "enter your password here" }
    },
    async authorize(credentials, req) {
        const username = credentials?.email;
        const password = credentials?.password;
        // db request to check wether the user is correct or not 
      const user = {
        name:"ojasva",
        id:"1",
        email:"ojasva@gmail.com"
      }

      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    }
  }),

  GoogleProvider({
    name:"google",
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    
  }),

  
],

})

export const GET=handler
export const POST=handler