//@ts-nocheck
import React, {useContext, useState} from "react";
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from "@mui/material/Typography";
import {Card, Grid, Paper} from "@mui/material";
import { styled } from "@mui/styles";
import Box from '@mui/material/Box';
import ScanDialog from "./dialogs/scanDialog";
import {userDetailsContext} from "../context";
import BasePage from "../components/page";
import {Helmet} from "react-helmet";

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

function Home({ isAdmin }){
    const [userDetails, setUserDetails] = useContext(userDetailsContext);
    const [visitorDetails, setVisitorDetails] = useContext(userDetailsContext);
    const [showScanDialog, setShowScanDialog] = useState(false);
    const [showNewUserDialog, setShowNewUserDialog] = useState(false);
    const [isVisitor, setIsVisitor] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [isNew, setIsNew] = useState(false);

    const [expanded, setExpanded] = React.useState('panel1');

    const handleAccordionChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleClose = () => {
        setShowScanDialog(false);
    }

    const showDialog = ({isVisitor = false, isStudent= false, isStaff = false, isNew = false}) => {
        setIsVisitor(isVisitor);
        setIsStudent(isStudent);
        setIsStaff(isStaff);
        setIsNew(isNew);
        setShowScanDialog(true);
    }

    return (
        <main className={"main"}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Home - Gatepass Management System</title>
            </Helmet>
            {showScanDialog && <ScanDialog onClose={handleClose} isVisitor={isVisitor} isStudent={isStudent} isStaff={isStaff} isNew={isNew} />}
            <Typography alignContent={"center"} variant={"h5"} fontWeight="bold">
                {isAdmin ? "Admin" : "Main"} Home
            </Typography>
            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')} style={{background: "transparent"}}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>Admissions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ flexGrow: 1 }} mt={2}>
                        <Grid container spacing={2} alignContent={"center"}>
                            <Grid item xs={6} py={4} onClick={() => showDialog({isStudent: true})}>
                                <Item style={{cursor: "pointer", paddingTop: "2rem", paddingBottom: "2rem", background: "#ade1d6"}}>
                                    <Typography variant={"button"}>Admit student</Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={6} py={4} onClick={() => showDialog({isStaff: true})}>
                                <Item style={{cursor: "pointer", paddingTop: "2rem", paddingBottom: "2rem", background: "#ade1d6"}}>
                                    <Typography variant={"button"}>Admit staff member</Typography>
                                </Item>
                            </Grid>
                            <Grid item xs={6} py={4} onClick={() => showDialog({isVisitor: true})}>
                                <Item style={{cursor: "pointer", paddingTop: "2rem", paddingBottom: "2rem", background: "#e1adad"}}>
                                    <Typography variant={"button"}>Admit visitor</Typography>
                                </Item>
                            </Grid>
                        </Grid>
                    </Box>
                </AccordionDetails>
            </Accordion>

            { isAdmin &&
                <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}  style={{background: "transparent"}}>
                    <AccordionSummary aria-controls="pane2d-content" id="panel2d-header">
                        <Typography>Registrations</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{flexGrow: 1}} mt={2}>
                            <Grid container spacing={2} alignContent={"center"}>
                                <Grid item xs={6} py={4} onClick={() => showDialog({isStudent: true, isNew: true})}>
                                    <Item style={{
                                        cursor: "pointer",
                                        paddingTop: "2rem",
                                        paddingBottom: "2rem",
                                        background: "#78e997"
                                    }}>
                                        <Typography variant={"button"}>Register new student</Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={6} py={4} onClick={() => showDialog({isStaff: true, isNew: true})}>
                                    <Item style={{
                                        cursor: "pointer",
                                        paddingTop: "2rem",
                                        paddingBottom: "2rem",
                                        background: "#7c5cf5"
                                    }}>
                                        <Typography variant={"button"}>Register new staff member</Typography>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            }

            {isAdmin &&
                <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}  style={{background: "transparent"}}>
                    <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                        <Typography>Admin Panel</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{flexGrow: 1}} mt={2}>
                            <Grid container spacing={2} alignContent={"center"}>
                                <Grid item xs={4} py={4} >
                                    <Item style={{
                                        cursor: "pointer",
                                        paddingTop: "2rem",
                                        paddingBottom: "2rem",
                                        background: "#cacaca"
                                    }}>
                                        <Typography component={"a"} href={"/admin/students"} variant={"body1"}>View
                                            students</Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={4} py={4} >
                                    <Item style={{
                                        cursor: "pointer",
                                        paddingTop: "2rem",
                                        paddingBottom: "2rem",
                                        background: "#cacaca"
                                    }}>
                                        <Typography component={"a"} href={"/admin/staff"} variant={"body1"}>View staff</Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={4} py={4} >
                                    <Item style={{
                                        cursor: "pointer",
                                        paddingTop: "2rem",
                                        paddingBottom: "2rem",
                                        background: "#cacaca"
                                    }}>
                                        <Typography component={"a"} href={"/admin/visitors"} variant={"body1"}>View
                                            visitors</Typography>
                                    </Item>
                                </Grid>
                                <Grid item xs={4} py={4} >
                                    <Item style={{
                                        cursor: "pointer",
                                        paddingTop: "2rem",
                                        paddingBottom: "2rem",
                                        background: "#cacaca"
                                    }}>
                                        <Typography component={"a"} href={"/admin/entries"} variant={"body1"}>View all
                                            entries</Typography>
                                    </Item>
                                </Grid>
                            </Grid>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            }
        </main>
    );
}

export default function ({ isAdmin = false }){
    return <BasePage children={<Home isAdmin={isAdmin} />} />
};