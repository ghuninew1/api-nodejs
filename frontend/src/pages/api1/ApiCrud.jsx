import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
// import { Link, useParams, Outlet } from 'react-router-dom'
import { ThemeContext } from '../../components/ThemeContext'

const StudentList = () => {
    const [students, setStudents] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [isEdit, setIsEdit] = useState(null)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [rollno, setRollno] = useState()
    const theme = useContext(ThemeContext)

    const className = theme === 'dark' ? 'table-dark' : 'table-light'

    useEffect(() => {
        handleGetdata()
    }, [])

    const handleGetdata = async () => {
        await axios.get('http://localhost:4000/api/student')
            .then((res) => {setStudents(res.data) })
            .catch((error) => {console.log(error)})
    }
    
    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:4000/api/student/`+ id )
            .catch((error) => {console.log(error)})

        handleGetdata();
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
            .catch(error => { console.log(error)})
 
        handleGetdata()
    }

    const handleChange = async (e) => {
        e.preventDefault()

        const StudentObject = {
            name: name,
            email: email,
            rollno: rollno
        }

        await axios.put(`http://localhost:4000/api/student/` + isEdit, StudentObject)
            .catch(error => { console.log(error)})

        handleGetdata()
        setIsEdit(null)
        setName('')
        setEmail('')
        setRollno('')
    }

return (
    <>
        <table className='table table-hover'>
            <thead className={className} >
                {isActive &&
                <tr className='table-active'>
                    <td><input type="text" placeholder='Name' value={name !== undefined ? name : "" } onChange={(e)=>setName(e.target.value)} /></td>
                    <td><input type="text" placeholder='Email' value={email !== undefined ? email : "" } onChange={(e)=>setEmail(e.target.value)} /></td>
                    <td><input type="number" placeholder='Detail'  value={rollno !== undefined ? rollno : "" } onChange={(e)=>setRollno(e.target.value)} /></td>
                    <td>{new Date().toLocaleString('th')}</td>
                    <td><button className='btn btn-outline-success' onClick={(e)=>handleCreate(e)} >Submit</button></td>
                </tr>}
                <tr >
                    <td>Name</td>
                    <td>Email</td>
                    <td>Rollno</td>
                    <td>updatedAt</td>
                    <td><button className='btn btn-outline-success' onClick={()=>setIsActive(!isActive)}>{isActive ? "Cancel" : "Add"}</button></td>
                </tr>
            </thead>
            <tbody>
            {students.map((obj) => ( 
  
            <tr key={obj._id} className='table-active' >
                {isEdit === obj._id ? <td><input type="text" value={name !== undefined ? name : obj.name } onChange={(e)=>setName(e.target.value)} /></td> :
                    <td>{obj.name}</td>}
                {isEdit === obj._id ? <td><input type="text" value={email !== undefined ? email : obj.email } onChange={(e)=>setEmail(e.target.value)} /></td> :
                    <td>{obj.email}</td>}
                {isEdit === obj._id ? <td><input type="number" value={rollno  !== undefined ? rollno : obj.rollno} onChange={(e)=>setRollno(e.target.value)} /></td> :
                    <td>{obj.rollno}</td>}
                {isEdit === obj._id ? <td>{new Date().toLocaleString('th')}</td> : <td>{new Date(obj.updatedAt).toLocaleString('th')}</td>}
                <td>
                    {isEdit === obj._id ? <button className='btn btn-outline-success' onClick={(e)=>handleChange(e)} >Save</button> :
                    <button className='btn btn-outline-success' onClick={()=>setIsEdit(obj._id)}>Edit</button>}
                    {isEdit === obj._id ? <button className='btn btn-outline-success' onClick={()=>setIsEdit(null)}>Cancel</button> : 
                    <button className='btn btn-outline-success' onClick={()=>handleDelete(obj._id)}>Delete</button>}
                </td>
            </tr>
            ))}                
            </tbody>
        </table>
    </>
  )
}

export default StudentList