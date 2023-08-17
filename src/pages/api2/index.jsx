import { useState } from 'react'
import PostForm from './PostForm'
// import AllPost from './AllPost'

const Api2 = () => {
  const [posts, setPosts] = useState([])
  return (
    <div>
      <PostForm posts={posts}/>
    </div>
  )
}

export default Api2