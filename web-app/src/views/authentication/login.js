import React, {useState} from "react";
import {Card, CircularProgress} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import {api} from "../../api";
import MessageSnackbars from "../../utils/alerts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Input from "../../utils/Controls/Input";
import Button from "@mui/material/Button";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, updateError] = useState({counter: 0, message: null});
    const [info, updateInfo] = useState({counter: 0, message: null});
    const [loading, setLoading] = useState(false);

    let navigate = useNavigate();
    let location = useLocation();
    let from = location.state?.from?.pathname || "/";

    const setError = (err) => {
        updateError({counter: ++error.counter, message: `${err} (${error.counter + 1})`});
    };

    const setInfo = (inf) => {
        updateInfo({counter: ++info.counter, message: `${inf} (${info.counter + 1})`});
    };

    const handleSignIn = async (event) => {
        event.preventDefault();

        if (username.length < 1) {
            setError("Please enter an username to login");
        } else if (password.length < 1) {
            setPassword("");
            setInfo("You didn't enter a password. Trying to login...");
        } else {
            setLoading(true);
            await login();
            setLoading(false);
        }
    };

    async function login() {
        await api()
            .post(`/staff/login`, {
                username,
                password,
            })
            .then((response) => {
                const data = response.data;
                if (data.success) {
                    const {username, name, role} = data.staff ?? {};
                    localStorage.setItem("username", username);
                    localStorage.setItem("name", name);
                    localStorage.setItem("role", role);
                    localStorage.setItem("isLoggedIn", "true");
                    navigate("/");
                } else {
                    setError(data.message ?? "Could not log you in.")
                }
            })
            .catch((err) => setError(err));
    }

    return (
        <main className={"main"}
              style={{height: "100%", display: "flex", flexFlow: "column", justifyContent: "center"}}>
            <Helmet>
                <meta charSet="utf-8"/>
                <title>Login - Gate-pass Management System</title>
            </Helmet>
            {error.message !== null && <MessageSnackbars message={error.message.toString().split("(")[0]} color="error"/>}
            {info.message !== null && <MessageSnackbars message={info.message.toString().split("(")[0]} color="info"/>}
            <Box style={{minWidth: "60%", margin: "auto"}}>
                <Card>
                    <Box
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                        mx={2}
                        mt={3}
                        p={2}
                        mb={1}
                        textAlign="center"
                    >
                        <Typography variant="h4" fontWeight="medium" mt={1}>
                            Sign in
                        </Typography>
                    </Box>
                    <Box pt={4} pb={3} px={3}>
                        <Box component="form" role="form" style={{position: "relative", zIndex: 100}}>
                            <Box mb={2}>
                                <Input
                                    type="text"
                                    required
                                    label="Username"
                                    fullWidth
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Box>
                            <Box mb={2}>
                                <Input
                                    type="password"
                                    required
                                    label="Password"
                                    fullWidth
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Box>
                            <Box mt={4} mb={1} display="flex" justifyContent="center">
                                {loading ? (
                                    <CircularProgress m="auto"/>
                                ) : (
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="info"
                                        fullWidth
                                        onClick={handleSignIn}
                                    >
                                        sign in
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </main>
    );
}

export default Login;