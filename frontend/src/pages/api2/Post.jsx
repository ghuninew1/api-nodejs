
const Post = (posts) => {


  return (
    <div>
        <h2>{posts.title}</h2>
        <p>{posts.message}</p>
    </div>
  )
}
//export default Post
export default connect()(Post)