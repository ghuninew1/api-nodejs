import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link, useParams, Outlet } from 'react-router-dom'
import { StudentContext } from './ThemeContext'

const StudentList = () => {
    const [students, setStudents] = useState([])
    const [ isActive, setIsActive ] = useState(true)
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [rollno, setRollno] = useState()

    useEffect(() => {
        getStudents()
    }, [])

    const getStudents = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/student')
            const data = response.data
            setStudents(data)
        } catch (error) {
            console.log(error)
        }
    }
    const deleteStudent = (id) => {
        axios.delete(`http://localhost:4000/api/student/`+ id )
            .then((res) => {console.log(res.data) })
            .catch((error) => {console.log(error)})

        setStudents(students.filter((obj) => obj._id !== id))           
    }


    const DataTable = () => (students.map((obj) =>  {
        return (
            <tr key={obj._id} >
            <td>{obj.name}</td>
            <td>{obj.email}</td>
            <td>{obj.rollno}</td>
            <td>{new Date(obj.updatedAt).toLocaleString('th')}</td>
            <td>
              {/* <button onClick={()=>setIsActive(true)}>Edit</button> */}
              <Link to={`/Api-List/edit/${obj._id}`}>Edit</Link>
              <button className='btn' onClick={()=>deleteStudent(obj._id)}>Delete</button>
          </td>
        </tr>
        )
    }))

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

        getStudents()
        alert('Student Added Successfully')
    }
  return (
    <>
        <StudentContext.Provider value={students}>
        <Outlet />
        <span >
            <h1>StudentList</h1>
            {isActive ? <button className='btn' onClick={()=>setIsActive(!isActive)}>Add</button> : 
            <button className='btn' onClick={()=>setIsActive(!isActive)}>Cancel</button> }
        </span>
        <table className='table'>
            <thead >
                <tr >
                    <td>Name</td>
                    <td>Email</td>
                    <td>Rollno</td>
                    <td>updatedAt</td>
                    <td>Actions</td>
                </tr>
                
            </thead>
            <tbody>
                {isActive ? <DataTable /> : 
                <tr >
                    <td><input type="text" value={name} onChange={(e)=>setName(e.target.value)} /></td>
                    <td><input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} /></td>
                    <td><input type="number" value={rollno} onChange={(e)=>setRollno(e.target.value)} /></td>
                    <td>{new Date().toLocaleString('th')}</td>
                    <td><button onClick={(e)=>onSubmit(e)} className="btn">Submit</button></td> 
                </tr>
                }
                
            </tbody>
        </table>
        </StudentContext.Provider>
    </>
  )
}

export default StudentList