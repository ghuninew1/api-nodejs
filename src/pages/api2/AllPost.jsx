import { connect } from 'react-redux'
import { useSelector } from 'react-redux'
import Post from './Post'
import EditComponent from './EditComponent'

const AllPost = () => {
  const posts = useSelector(state => state)
  console.log(posts)
  return (
    <div>
      <h1>All Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          {post.editing ? <EditComponent post={post} key={post.id} /> : <Post post={post} key={post.id} />}
          </div>
      ))}
    </div>
  )
}
const mapStateToProps = (state) => {
  return {
    posts: state
  }
}

export default connect(mapStateToProps)(AllPost)