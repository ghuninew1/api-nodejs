import axios from 'axios'
import  { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const EditStudent = () => {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [rollno, setRollno] = useState()
    const [students, setStudents] = useState([])
    let { id } = useParams()

    useEffect(() => {
        fetchData()        
    }, [id])

    async function fetchData() {
        const response = await axios.get('http://localhost:4000/api/student/' + id)
        const data = response.data
        setStudents(data)
    }

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

        await axios.put(`http://localhost:4000/api/student/` + id, StudentObject)
            .then(res => console.log(res.data))
            .catch(error => { console.log(error)})
    }
return (
    <>
        <h1>EditStudent</h1>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Student Name</label>
                <input type="text" value={students.name} onChange={(e)=>setName(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Student Email</label>
                <input type="text" value={students.email} onChange={(e)=>setEmail(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Student Rollno</label>
                <input type="number" value={students.rollno} onChange={(e)=>setRollno(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <button type="submit" className="btn">Submit</button>
            </div>
        </form>
    </>
  )
}

export default EditStudent