import { useState } from "react";

const PostForm = (posts) => {
  const [ title, setTitle ] = useState('')
  const [ message, setMessage ] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      id: new Date().getTime().toString(),
      title: title,
      message: message,
      editing: false,
    };
    console.log(data)
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          name="title"
          placeholder="Enter post title"
          required
        />
        <br />
        <br />
        <textarea
          cols="30"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          name="message"
          rows="5"
          placeholder="Enter post"
          required
        />
        <br />
        <br />
        <button type='submit'>Post</button>
      </form>
    </div>
  );
};
export default PostForm;


