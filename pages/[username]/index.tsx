import React from 'react'
import UserProfile from '../../components/UserProfile'
import PostFeed from '../../components/PostFeed'
import { db, getUserWithUsername, postToJSON } from '../../lib/firebase'
import { UserModel, PostModel } from '../../lib/types'
import { query, collection, where, getDocs, limit, orderBy } from 'firebase/firestore'

export async function getServerSideProps({ query: serverquery }: { query: { username: string } }) {
  const { username } = serverquery
  const userDoc = await getUserWithUsername(username)

  // JSON serialization of the user object
  let user = null
  let posts = null
  if (userDoc) {
    user = userDoc.data()
    const postsQuery = query(collection(db, 'posts'), where('published', '==', true), orderBy('createdAt', 'desc'), limit(5))
    const postsSnapshot = await getDocs(postsQuery)
    posts = postsSnapshot.docs.map(postToJSON)
  }
  return {
    props: {
      user,
      posts
    }  // will be passed to the page component as props
  }
}

export default function UserProfilePage({ user, posts }: { user: UserModel, posts: PostModel[] }) {
  return (
    <main>
      <UserProfile user={user} />
      {posts && <PostFeed posts={posts} admin={true} />}
    </main>
  )
}
