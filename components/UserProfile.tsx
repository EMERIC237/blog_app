import React from 'react'
import { UserModel } from '../lib/types';

export default function UserProfile({ user }: { user: UserModel }) {
    return (
      <div className="box-center">
        <img src={user.photoURL || '/hacker.png'} className="card-img-center" />
        <p>
          <i>@{user.username}</i>
        </p>
        <h1>{user.displayName || 'Anonymous User'}</h1>
      </div>
    );
  }
