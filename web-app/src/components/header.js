import React, {useState} from "react";
import {AccountCircleOutlined, LockOutlined, Logout} from "@mui/icons-material";
import {Link, useLocation, useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function Header(){
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const homeLink = role === "ADMIN" ? "/admin" : "/";

    const requestRefresh = () => setRefresh(!refresh);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <header className="App-header flex flex-between" style={{position: "sticky"}}>
            {/*<img src={logo} className="App-logo" alt="logo" />*/}
            <Link to={"/"}><LockOutlined className={"App-logo logo"}/></Link>
            <div className={"header-links"}>
                <li>
                    <ul><Link to={homeLink}>Home</Link></ul>
                    {/*<ul><Link to={"/admin"}>Admin panel</Link></ul>*/}
                    {/*<ul><Link to={"/newStudent"}>New student</Link></ul>*/}
                    <ul>
                        <Typography variant={"overline"}>
                            Logged in as {localStorage.getItem('role')}
                        </Typography>
                        {/*<AccountCircleOutlined className={"account-img-small"}/>*/}
                    </ul>
                    <ul><Button onClick={handleLogout}><Logout />&nbsp;Logout</Button></ul>
                </li>
            </div>
        </header>
    );
}

export default Header;