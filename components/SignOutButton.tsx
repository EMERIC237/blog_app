import React from 'react'
import { signOut } from 'firebase/auth';
import { auth, } from '../lib/firebase';



export default function SignOutButton() {
    const signOutHandle = async () => {
        try {
            await signOut(auth);
        } catch (error: any) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        }
    }

    return <button onClick={signOutHandle}>Sign Out</button>;
}
