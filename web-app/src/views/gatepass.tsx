//@ts-nocheck
import React, {useEffect, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import {Grid, IconButton} from "@mui/material";
import Box from '@mui/material/Box';
import BasePage from "../components/page";
import {useSearchParams} from "react-router-dom";
import unknownUser from "assets/images/unknownUser.png";
import {api} from "../api";
import {shortDate} from "../utils/tables/DateUtilities";
import {PrintRounded} from "@mui/icons-material";
import {useReactToPrint} from "react-to-print";
import Loading from "../utils/loading";
import {format} from "date-fns";
import {Helmet} from "react-helmet";

const marginTop = "2rem";
const marginRight = "1rem";
const marginBottom = "2rem";
const marginLeft = "1rem";
const getPageMargins = () => {
    return `@page { margin: ${marginTop} ${marginRight} ${marginBottom} ${marginLeft} !important; }`;
};

const pageStyle = `
  ${getPageMargins()}

  @media all {
    .pagebreak {
      display: none;
    }
  }

  @media print {
    .pagebreak {
      page-break-before: always;
    }
  }
`;

function GatePass() {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);

    const [params, setParams] = useSearchParams();
    const userType = params.get("type");
    const userId = params.get("id");

    // For printing
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        // Get current user from db
        async function fetchUser() {
            setLoading(true);
            api().get(`/${userType}s/${userId}`)
                .then(response => {
                    const data = response.data;
                    if (data.success) {
                        setUser(data[userType] ?? []);
                    } else {
                        setError(`Could not fetch ${userType}. ${data.message ?? ''}`);
                        return;
                    }
                })
                .catch(error => {
                    setError(error);
                })
                .finally(() => {
                    setLoading(false);
                })
        }

        fetchUser().then(() => {
        })
    }, [params])

    return (
        <main className={"main"}>
            {/*{showScanDialog && <ScanDialog onClose={handleClose} isVisitor={isVisitor} isStudent={isStudent} isStaff={isStaff} isNew={isNew} />}*/}
            <Box display="flex" alignItems="center">
                <Box>
                    <Typography alignContent={"center"} variant={"h5"} fontWeight="bold">
                        Gatepass
                    </Typography>
                </Box>
                <Box ml="auto">
                    <IconButton circular alignContent={"center"} onClick={handlePrint}>
                        <PrintRounded/>
                    </IconButton>
                </Box>
            </Box>

            {
                loading ? <Loading/>
                    :
                    <Box sx={{flexGrow: 1}} mt={2} ref={componentRef}>
                        <style>
                            {pageStyle}
                        </style>
                        <Typography variant={"h6"} textTransform="capitalize" align="center" fontWeight="bold">Gatepass
                            for {user.name}</Typography>
                        <Grid container spacing={4} justifyContent={"center"}>
                            <Grid item xs={"auto"} py={1}>
                                <Box pt={2} pb={2} style={{cursor: "pointer"}} display="flex" flexDirection="column">
                                    <img src={user.profile_photo ?? unknownUser} alt={"user-image"}
                                         style={{width: "230px"}}/>
                                </Box>
                            </Grid>
                            <Grid item xs={"auto"} py={1}>
                                <Box pt={2} pb={2} display="flex" flexDirection="column" alignItems="flex-start">
                                    <Box py={1}><Typography variant={"overline"}
                                                            style={{textAlign: "left"}}><b>Name:</b> {user.name ?? "Could not load"}
                                    </Typography></Box>
                                    <Box py={1}><Typography variant={"overline"}
                                                            style={{textAlign: "left"}}><b>ID:</b> {user.id_no ?? "Could not load"}
                                    </Typography></Box>
                                    <Box py={1}><Typography variant={"overline"}
                                                            style={{textAlign: "left"}}><b>SEX:</b> {user.gender ?? "Could not load"}
                                    </Typography></Box>
                                    <Box py={1}><Typography variant={"overline"} style={{textAlign: "left"}}><b>Purpose
                                        of
                                        Visit:</b> {user.purpose_of_visit ?? "Could not load"}</Typography></Box>
                                    <Box py={1}><Typography variant={"overline"}
                                                            style={{textAlign: "left"}}><b>Date:</b> {shortDate(user.date_time ?? '0') ?? "Could not load"}
                                    </Typography></Box>
                                </Box>
                            </Grid>
                            <Grid item xs={"auto"} py={1} pt={0} alignItems="center">
                                <Box py={0} alignItems="center">
                                    <Typography variant={"overline"} align="center" textAlign="center">
                                        THIS GATE-PASS DOCUMENT WAS GENERATED ON {format(new Date(), "dd-MM-yyyy hh:mm:ss aa")}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
            }
        </main>
    );
}

export default function () {
    return <BasePage children={<GatePass/>}/>
};