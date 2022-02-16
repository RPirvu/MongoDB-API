import Axios, {AxiosResponse} from 'axios';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { myContext } from '../Pages/Context';
 
export default function Navbar() {
    const ctx = useContext(myContext);

    const logout = () => {
        Axios.get("http://localhost:4000/logout", {
          withCredentials: true
        }).then((res : AxiosResponse) => {
          if (res.data === "success") {
            window.location.href = "/";
          }
        })
      }
    return (
        <div className="NavContainer">
          <Link to="/">Home</Link>
        {ctx ? (
            <>
            <Link onClick={logout} to="/logout">Logout</Link>
            {ctx.role === 'Admin' ? ( <Link to="/admin">Admin</Link>) : null}
            <Link to="/profile">Profile</Link>
            </>
        ) : (
            <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>
        )
        }       
        </div>
    )
}
