import React from 'react'
import { useContext, useState, useEffect, useCallback } from 'react';
import SignOutButton from '../components/SignOutButton';
import SignInButton from '../components/SignInButton';
import { doc, writeBatch, getDoc } from 'firebase/firestore';
import { UserContext } from '../lib/context';
import { useDebounce } from '../lib/hooks'
import { db } from '../lib/firebase';
type Props = {
  user: any
}


export default function Enter(props: Props) {
  const { user, username } = useContext(UserContext)


  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />
  return (
    <main>
      {/* <Metatags title="Enter" description="Sign up for this amazing app!" /> */}
      {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
    </main>
  );
}



function UsernameForm() {
  const [formValue, setFormValue] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const debouncedValue = useDebounce(formValue, 500);
  // hit the database to check if the username is taken
  const checkUsername = useCallback(async (username: string | null) => {
    if (username && username.length >= 3) {
      const usernameDoc = doc(db, "usernames", username);
      const usernameSnap = await getDoc(usernameDoc);
      const exists = usernameSnap.exists()
      console.log('firestore read executed')
      setIsValid(!exists);
      setLoading(false);
    }
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // create ref for the user and the username(with formValue) in the database
    const userDoc = doc(db, "users", user!.uid);
    const usernameDoc = doc(db, "usernames", formValue);

    // commit both doc together as a batch write operation
    const batch = writeBatch(db);
    batch.set(userDoc, { username: formValue, photoURL: user?.photoURL, displayName: user?.displayName });
    batch.set(usernameDoc, { uid: user!.uid });

    // commit the batch write operation
    await batch.commit();
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // force the value typed to match the correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

    // only set value if length is greater than 3 Or it passes the regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  }
  //

  useEffect(() => {
    checkUsername(debouncedValue);
  }, [debouncedValue, checkUsername]);

  return (
    <section>
      <h3>Choose Username</h3>
      <form onSubmit={onSubmit}>
        <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
        <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
        <button type="submit" className="btn-green" disabled={!isValid}>
          Choose
        </button>

        <h3>Debug State</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid: {isValid.toString()}
        </div>
      </form>
    </section>
  );

}

function UsernameMessage(props: { username: string, isValid: boolean, loading: boolean }) {
  const { username, isValid, loading } = props;
  if (loading) {
    return <p>Checking username...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">The username {username} is taken!</p>;
  } else {
    return <p>Enter a username</p>;
  }
}