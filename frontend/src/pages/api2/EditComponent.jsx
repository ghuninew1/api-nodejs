

const EditComponent = () => {

  const handleEdit = (e) => {
    e.preventDefault();
    const newTitle = e.target.elements.title.value;
    const newMessage = e.target.elements.message.value;
    const data = {
      newTitle,
      newMessage
    }
    console.log(data);

  }
  return (
    <div>
      <form onSubmit={(e)=>handleEdit(e)}>
        <input required type="text" placeholder="Enter Post Title" /><br /><br />
        <textarea required rows="5" cols="28" placeholder="Enter Post" /><br /><br />
        <button>Update</button>
      </form>
    </div>
  )
}
export default EditComponent;
