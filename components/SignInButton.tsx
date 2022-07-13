import React from 'react'
import Image from 'next/image';
import { signInWithPopup } from 'firebase/auth';
import { googleAuthProvider, auth } from '../lib/firebase';

export default function SignInButton() {
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleAuthProvider);
        } catch (error: any) {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            console.log(errorCode, errorMessage, email);
        }
    }


    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <Image src={'/google.png'} alt="goole logo" width={"30px"} height={30} /> Sign in with Google
        </button>
    );
}
