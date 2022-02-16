import React, {useEffect, useState, useContext} from 'react';
import axios, {AxiosResponse} from 'axios';
import { myContext } from './Context'
import { UserInterface } from '../Interfaces/Interfaces';
export default function AdminPage() {
    const ctx = useContext(myContext);
    const [data, setData] = useState<any>();
    const [selectedUser, setSelectedUser] = useState<string>();
    useEffect(() => {
        axios.get("http://localhost:4000/getallusers", {
          withCredentials: true
        }).then((res : AxiosResponse) => {
          setData(res.data.filter((item : UserInterface) => {
            return item.username !== ctx.username
          }))
        })
      }, [ctx]);
      if (!data) {
        return null;
      }
 

    const deleteUser = () => {
        let userid : string;
        data.forEach((item : UserInterface) => {
            if(item.username === selectedUser) {
                userid = item.id;
            }
        })
        axios.post("http://localhost:4000/deleteuser", { id: userid! }, {withCredentials: true})
    }

    return (
        <div>
            <h1>Admin Page, Only Admins Can See This!</h1>
            <select onChange={e => setSelectedUser(e.target.value)} name="deteleuser" id="deleteuser">
            <option id="Select A User">Select</option>
            {
               data.map((item : UserInterface) => {
                   return(
                       <option id={item.id}>{item.username}</option>
                   )
               })
            } 
            </select>
            <button onClick={deleteUser}>Delete</button>
        </div>
    )
}
