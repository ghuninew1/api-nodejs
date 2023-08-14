import { useState } from 'react'
import axios from 'axios'

const CreateStudent = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [rollno, setRollno] = useState('')

    const onChangeStudentName = (e) => {
        setName(e.target.value)
    }
    const onChangeStudentEmail = (e) => {
        setEmail(e.target.value)
    }
    const onChangeStudentRollno = (e) => {
        setRollno(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()

        // setName('')
        // setEmail('')
        // setRollno('')

        const StudentObject = {
            name: name,
            email: email,
            rollno: rollno
        }

        axios.post('http://localhost:4000/api/student', StudentObject)
            .then(res => console.log(res.data))

        alert('Student Added Successfully')
    }
  return (
    <div>
        <h1>CreateStudent</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Student Name</label>
                <input type="text" className="form-control" value={name} onChange={onChangeStudentName} />
            </div>
            <div className="form-group">
                <label>Student Email</label>
                <input type="text" className="form-control" value={email} onChange={onChangeStudentEmail} />
            </div>
            <div className="form-group">
                <label>Student Rollno</label>
                <input type="text" className="form-control" value={rollno} onChange={onChangeStudentRollno} />
            </div>
            <div className="form-group">
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>            
    </div>
  )
}

export default CreateStudent