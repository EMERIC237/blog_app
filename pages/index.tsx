import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const Home: NextPage = () => {
  return (
    <div>
      <Loader show />
      <button onClick={() => toast.success('Success!')}>Success</button>
    </div>
  )
}

export default Home
