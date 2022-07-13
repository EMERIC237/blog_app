import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SignOutButton from './SignOutButton';
import { UserContext } from '../lib/context';
import { useContext } from 'react';
export default function Navbar() {
  const { user, username } = useContext(UserContext)
  return (
    <div className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
        {/* user is signed-in and has username */}
        {username && (
          <>
            <li>
              <SignOutButton />
            </li>
            <li className='push-left'>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                {user && user.photoURL != null && (<Image src={user?.photoURL} alt="profile picture" width={50} height={50} />)}
              </Link>
            </li>
          </>
        )}
        {/* user is not signed-in or has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Login</button>
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}
