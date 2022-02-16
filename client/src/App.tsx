import React, { useContext } from 'react';
import Navbar from './Components/Navbar';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import Homepage from './Pages/Homepage';
import AdminPage from './Pages/AdminPage';
import "./main.css";
import { myContext } from './Pages/Context';
import Register from './Pages/Register';

function App() {

  const ctx = useContext(myContext);
  
  return (
    <BrowserRouter>
     
      <Navbar/>
      <Switch>
      {ctx ? (
            <>
            {ctx.role==='Admin'? <Route exact path='/admin' component={AdminPage}></Route> : null}
            <Route exact path='/profile' component={Profile}></Route>
            </>
        ) : (
            <>
            <Route exact path='/login' component={Login}></Route>
            <Route exact path='/register' component={Register}></Route> 
            <Route exact path='/profile' component={Profile}></Route>
            </>
        )
        }
        <Route exact path='/' component={Homepage}></Route>
       </Switch>
      
    </BrowserRouter>
  );
}

export default App;


 

