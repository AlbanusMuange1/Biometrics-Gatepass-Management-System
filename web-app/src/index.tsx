import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createTheme} from "@mui/material/styles";
import {green, orange, red} from "@mui/material/colors";
import {ThemeProvider} from "@mui/styles";
import UserDetailsProvider from "./context";

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
            success: string;
            warning: string;
            error: string;
        };
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
            success?: string;
            warning?: string;
            error?: string;
        };
    }
}

const theme = createTheme({
    status: {
        danger: orange[500],
        success: green[500],
        warning: orange[500],
        error: red[500],
    },
});

ReactDOM.render(
    <React.StrictMode>
        <UserDetailsProvider>
            <ThemeProvider theme={theme}>
                <App/>
            </ThemeProvider>
        </UserDetailsProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

