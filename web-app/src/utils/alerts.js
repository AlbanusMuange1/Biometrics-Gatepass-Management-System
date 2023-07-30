import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MessageSnackbars({message, color = "info"}) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    };

    return (
        <Stack spacing={2} sx={{width: "100%"}}>
            <Snackbar
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={open}
                autoHideDuration={10000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={color.toString()} sx={{width: "100%"}}>
                    {message.toString()}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
