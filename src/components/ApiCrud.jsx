import axios from 'axios'
import { useState, useEffect } from 'react'
// import { Link, useParams, Outlet } from 'react-router-dom'

const StudentList = () => {
    const [students, setStudents] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [rollno, setRollno] = useState()

    useEffect(() => {
        handleGetdata()
    }, [])

    const handleGetdata = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/student')
            const data = response.data
            setStudents(data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:4000/api/student/`+ id )
            .then((res) => {console.log(res.data) })
            .catch((error) => {console.log(error)})

        setStudents(students.filter((obj) => obj._id !== id))           
    }

    const handleCreate = async (e) => {
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

        handleGetdata()
    }
    const handleChange = async (e) => {
        e.preventDefault()

        setName('')
        setEmail('')
        setRollno('')

        const StudentObject = {
            name: name,
            email: email,
            rollno: rollno
        }

        await axios.put(`http://localhost:4000/api/student/` + isEdit, StudentObject)
            .then(res => console.log(res.data))
            .catch(error => { console.log(error)})

        handleGetdata()
        setIsEdit(null)
    }

return (
    <>
        <table className='table'>
            <thead >
                {isActive &&
                <tr >
                    <td><input type="text" placeholder='Name' value={name} onChange={(e)=>setName(e.target.value)} /></td>
                    <td><input type="text" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value)} /></td>
                    <td><input type="number" placeholder='Detail'  value={rollno} onChange={(e)=>setRollno(e.target.value)} /></td>
                    <td>{new Date().toLocaleString('th')}</td>
                    <td><button className='btn' onClick={(e)=>handleCreate(e)} >Submit</button></td>
                </tr>}
                <tr >
                    <td>Name</td>
                    <td>Email</td>
                    <td>Rollno</td>
                    <td>updatedAt</td>
                    <td><button className='btn' onClick={()=>setIsActive(!isActive)}>{isActive ? "Cancel" : "Add"}</button></td>
                </tr>
            </thead>
            <tbody>
            {students.map((obj) => ( 
  
            <tr key={obj._id} >
                {isEdit === obj._id ? <td><input type="text" value={name !== undefined ? name : obj.name} onChange={(e)=>setName(e.target.value)} /></td> :
                    <td>{obj.name}</td>}
                {isEdit === obj._id ? <td><input type="text" value={email !== undefined ? email : obj.email} onChange={(e)=>setEmail(e.target.value)} /></td> :
                    <td>{obj.email}</td>}
                {isEdit === obj._id ? <td><input type="number" value={rollno !== undefined ? rollno : obj.rollno} onChange={(e)=>setRollno(e.target.value)} /></td> :
                    <td>{obj.rollno}</td>}
                {isEdit === obj._id ? <td>{new Date().toLocaleString('th')}</td> : <td>{new Date(obj.updatedAt).toLocaleString('th')}</td>}
                <td>
                    {isEdit === obj._id ? <button className='btn' onClick={(e)=>handleChange(e)} >Save</button> :
                    <button className='btn' onClick={()=>setIsEdit(obj._id)}>Edit</button>}
                    {isEdit === obj._id ? <button className='btn' onClick={()=>setIsEdit(null)}>Cancel</button> : 
                    <button className='btn' onClick={()=>handleDelete(obj._id)}>Delete</button>}
                </td>
            </tr>
            ))}                
            </tbody>
        </table>
    </>
  )
}

export default StudentList