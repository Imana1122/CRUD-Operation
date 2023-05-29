import logo from './logo.svg';
import './App.css';

import { useEffect, useState } from 'react';
import axios from "axios"
import View from './component/View';


axios.defaults.baseURL = "http://localhost:8080/"
function App() {

  const [addSection, setAddSection] = useState(false)
  const [editSection, setEditSection] = useState(false)
  const [formData, setFormData] = useState({
    name : "",
    email : "",
    mobile : "",
  })
  const [formDataEdit, setFormDataEdit] = useState({
    name : "",
    email : "",
    mobile : "",
    _id : ""
  })


  const [dataList, setDataList] = useState([])

  const handleOnChange = (e)=>{
    const {value, name} =e.target
    setFormData((preve)=>{
        return{
          ...preve,
          [name] : value
        }
    })
  }

  const handleSubmit  = async(e)=>{
    e.preventDefault()    
    const data =  await axios.post("/create",formData)

    
    if (data.data.success) {
      console.log(data)
      setAddSection(false);
      alert(data.data.message);
      getFetchData()
      setFormData({
        name : "",
        email : "",
        mobile : ""
      })
    }
    
  }

  const getFetchData = async()=>{
    const data =  await axios.get("/")   
    console.log(data)
    if (data.data.success) {
      setDataList(data.data.data)
    }
  }

  useEffect(()=>{
    getFetchData()
  },[])

  const handleDelete = async(id)=>{
    const data =  await axios.delete("/delete/"+id)   
    alert(data.data.message)
    if(data.data.success){
      getFetchData()
      alert(data.data.message)
    }
  }

  console.log(dataList)

  const handleUpdate = async(e)=>{
    e.preventDefault()
    const data = await axios.put("/update", {_id:formDataEdit._id, ...formDataEdit})
    
    if(data.data.success){
      console.log(data)
      getFetchData()
      alert(data.data.message)
      setEditSection(false)
      
    }
  }

  const handleEditOnChange = async(e)=>{
    const {value, name} =e.target
    setFormDataEdit((preve)=>{
        return{
          ...preve,
          [name] : value
        }
    })
  }

  const handleEdit = (e1)=>{
    setFormDataEdit(e1)
    setEditSection(true)
  }

  return (
    <>
      <div className='container'>
        <button className='btn btn-add' onClick={()=>setAddSection(true)}>Add</button>
        {
          addSection &&(
            <View
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleClose={()=>{
              setAddSection(false)
              
            }}
            rest = {formData}
            />
          )
        }

        {
          editSection && (
            <View
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleClose={()=>{setEditSection(false)
            }}
            rest = {formDataEdit}
            />
          )
        }

        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Upate</th>
              </tr>
            </thead>
            <tbody>
              { dataList[0]? (
                dataList.map((e1)=>{
                  console.log(e1)
                  return(
                    <tr>
                      <td>{e1.name}</td>
                      <td>{e1.email}</td>
                      <td>{e1.mobile}</td>
                      <td>
                      <button className='btn btn-edit' onClick={()=>{handleEdit(e1)}}>Edit</button>
                      <button className='btn btn-delete' onClick={()=>handleDelete(e1._id)}>Delete</button>
                      </td>
                    </tr>
                  )
                }))
                : (
                  <p style={{textAlign: "center"}}>No data</p>
                )
              }
            </tbody>
          </table>
        </div>
       
      </div>
    </>
  );
}

export default App;
