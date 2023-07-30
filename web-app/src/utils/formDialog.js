import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {axiosError, parseResponse} from "utils/index";
import {api} from "api";

export function AddHostelDialog({ onError, onInfo, onUpdate }) {
    const [open, setOpen] = React.useState(true);
    const [name, setName] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [newHostel, setNewHostel] = React.useState(null);


    async function addHostel(){
        if (name.length < 1){
            onError("Enter the hostel name")
        } else {
            setLoading(true);
            await  api().post('hostels', {name, active: true})
                .then(response => {
                    parseResponse(response, "hostel", onError, setNewHostel);
                    onInfo("The hostel has been created.");
                    onUpdate();
                }).catch(err => axiosError("Create hostel", err, onError));
            setLoading(false);
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add hostel</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the hostel name below
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Hostel name"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => addHostel()}>Add hostel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export function AddRoomDialog({ onError, onInfo, onUpdate }) {
    const [open, setOpen] = React.useState(true);
    const [name, setName] = React.useState('');
    const [hostelId, setHostelId] = React.useState('');
    const [roomCost, setRoomCost] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [newRoom, setNewRoom] = React.useState(null);


    async function addRoom(){
        if (name.length < 1){
            onError("Enter the room name")
        }else if (roomCost.length < 1){
            onError("Enter the room cost")
        }else if (hostelId.length < 1){
            onError("Enter the hostel id")
        } else {
            setLoading(true);
            await  api().post('rooms', {name, hostel_id: hostelId, room_cost: roomCost, active: 1})
                .then(response => {
                    parseResponse(response, "room", onError, setNewRoom);
                    onInfo("The room has been created.");
                    onUpdate();
                }).catch(err => axiosError("Create hostel", err, onError));
            setLoading(false);
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle>Add room</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the hostel name below
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Room name"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Hostel id"
                        type="number"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setHostelId(e.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Room cost"
                        type="number"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setRoomCost(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => addRoom()}>Add room</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
