import axios from 'axios'
import { useState, useEffect } from 'react'
import { Link,Routes, Route,useParams } from 'react-router-dom'
import { StudentContext } from './ThemeContext'
import EditStudent from './EditStudent'

const StudentList = () => {
    const [students, setStudents] = useState([])
    const [ isActive, setIsActive ] = useState(false)


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
            <td>{String(obj.updatedAt).substring(8,22)}</td>
            <td>
              {/* <button onClick={()=>setIsActive(true)}>Edit</button> */}
              <Link to={`/edit/${obj._id}`}>Edit</Link>
              <button onClick={()=>deleteStudent(obj._id)}>Delete</button>
          </td>
        </tr>
        )
    }))

  console.log(students)
  return (
    <>
        <StudentContext.Provider value={students}>
        <h1>StudentList</h1>
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
                {isActive ? <EditStudent /> : <DataTable />}
                

            </tbody>
        </table>
        </StudentContext.Provider>
    </>
  )
}

export default StudentList