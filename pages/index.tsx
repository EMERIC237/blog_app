import type { NextPage } from 'next'
import { useState } from 'react';
import { query, collectionGroup, where, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
import { UserModel, PostModel } from "../lib/types";
import { db, fromMillis, postToJSON } from '../lib/firebase';
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import PostFeed from '../components/PostFeed';
type HomeProps = {
  posts: PostModel[]
}
// Max posts to query per page
const LIMIT = 1;
export async function getServerSideProps(_context: any) {
  const postsQuery = query(collectionGroup(db, 'posts'),
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT))
  const postsSnapshot = await getDocs(postsQuery)
  const posts = postsSnapshot.docs.map(postToJSON)
  console.log("this is the fetched posts :", posts)
  return { props: { posts } }
}


const Home: NextPage<HomeProps> = (props: HomeProps) => {
  const { posts: fetchedPosts } = props
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState(fetchedPosts);
  const [postsEnd, setPostsEnd] = useState(false)

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor = typeof last.createdAt === 'number' ? fromMillis(last.createdAt) : last.createdAt;
    const postsQuery = query(collectionGroup(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      startAfter(cursor),
      limit(LIMIT))

    const postsSnapshot = await getDocs(postsQuery)
    const newPosts = postsSnapshot.docs.map((doc) => doc.data())
    setPosts([...posts, ...(newPosts as PostModel[])])
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true)
    }
  }


  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && (<button onClick={getMorePosts}>Load more</button>)}
      <Loader show={loading} />
      {postsEnd && <p>No more posts available, make a post and share with other</p>}
    </main>
  )
}

export default Home
