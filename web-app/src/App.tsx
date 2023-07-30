import React from 'react';
import './App.css';
import {AccountCircleOutlined, LockOutlined} from "@mui/icons-material";
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Home from "./views/home";
import NewUser from "./views/newUser";
import Gatepass from "./views/gatepass";
import List from "./views/admin/list";
import Login from "./views/authentication/login";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login/>} />
                    <Route path="/" element={<Home/>} />
                    <Route path="/newStudent" element={<NewUser userType={"STUDENT"} />}/>
                    <Route path="/newStaff" element={<NewUser userType={"STAFF"}/>}/>
                    <Route path="/newVisitor" element={<NewUser userType={"VISITOR"}/>}/>
                    <Route path="/gatepass" element={<Gatepass/>}/>

                    {/* Admin routes */}
                    <Route path="/admin" element={<Home isAdmin={true} />}/>
                    <Route path="/admin/students" element={<List type={"students"}/>}/>
                    <Route path="/admin/staff" element={<List type={"staff"}/>}/>
                    <Route path="/admin/visitors" element={<List type={"visitors"}/>}/>
                    <Route path="/admin/entries" element={<List type={"entries"}/>}/>

                    {/*<Route path="invoices" element={<Invoices/>}/>*/}
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
