import { useState } from 'react'
import axios from 'axios'

const CreateStudent = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [rollno, setRollno] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()

        setName('')
        setEmail('')
        setRollno('')

        const StudentObject = {
            name: name,
            email: email,
            rollno: rollno
        }

        await axios.post('http://localhost:4000/api/student', StudentObject)
            .then(res => console.log(res.data))

        alert('Student Added Successfully')
    }
  return (
    <div>
        <h1>CreateStudent</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input type="text" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Email</label>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Rollno</label>
                <input type="number"  value={rollno} onChange={(e)=>setRollno(e.target.value)} />
            </div>
            <div className="form-group">
                <button type="submit" className="btn">Submit</button>
            </div>
        </form>            
    </div>
  )
}

export default CreateStudent