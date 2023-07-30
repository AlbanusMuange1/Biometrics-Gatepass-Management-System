//@ts-nocheck
import React, {useContext, useEffect, useState} from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {errors} from "../../utils/constants";
import MessageSnackbars from "../../utils/alerts";
import defaultImage from "assets/images/scanning.png";
import scanFailed from "assets/images/scanFailed.png";
import scanSuccessful from "assets/images/scanSuccesful.png";
import unknownUser from "assets/images/unknownUser.png";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Loading from "../../utils/loading";
import Button from "@mui/material/Button";
import {Grid} from "@mui/material";
import {StaffData, StudentData, userDetailsContext, VisitorData} from "../../context";
import {useNavigate} from "react-router-dom";
import {fingerprintMatcher} from "../../utils/fingerprintMatcher";
import {api} from "../../api";

// import Button from "utils/Controls/Button";

interface ScanResult {
    "ErrorCode": number,
    "Manufacturer": string,
    "Model": string,
    "SerialNumber": string,
    "ImageWidth": number,
    "ImageHeight": number,
    "ImageDPI": number,
    "ImageQuality": number,
    "NFIQ": number,
    "ImageDataBase64": object,
    "BMPBase64": string,
    "WSQImageSize": number,
    "ISOTemplateBase64": string,
    "TemplateBase64": string,
    WSQImage: string
}

interface EnrolResult {
    ErrorCode: number,
    Manufacturer: string,
    Model: string,
    SerialNumber: string,
    ImageWidth: number,
    ImageHeight: number,
    ImageDPI: number,
    ImageQuality: number,
    ImageNFIQ: number,
    Attempts: number,
    Result: number,
    EnrollData: {
        Templates: [Template]
    }
    SerHandle: number,
    BMPBase64: string
}

interface Template {
    fpos: string,
    nfiq: string,
    TemplateBase64: string
}

export const saveAdmissionEntry = async (userType, userId, setInfo, setError) => {
    await api().post('entries',
        {
            user_type: userType,
            identification: userId,
        })
        .then(response => {
            const data = response.data;
            console.log(data)
            if (data.success) {
                setInfo(data.message);
            } else {
                setError(data.message);
            }
        }).catch(error => {
            if (error.response) {
                const data = error.response.data;
                console.log(data);
                setError(data.message);
            }
        });
}

function ScanDialog({onClose, isVisitor = false, isStudent = true, isStaff = false, isNew = false}) {
    const [userDetails, setUserDetails] = useContext(userDetailsContext);
    let navigate = useNavigate();
    const [open, setOpen] = React.useState(true);
    const [refresh, setRefresh] = React.useState(false);
    const [scanData, setScanData] = React.useState<EnrolResult | ScanResult>(undefined);
    const [matchedUser, setMatchedUser] = React.useState<StudentData | StaffData | VisitorData>(undefined);
    const [scanning, setScanning] = React.useState(false);
    const [error, updateError] = useState({counter: 0, message: null});
    const [info, updateInfo] = useState({counter: 0, message: null});

    const requestRefresh = () => {
        setRefresh(!refresh);
    }

    const setError = (err) => {
        updateError({counter: ++error.counter, message: `${err} (${error.counter + 1})`});
    };

    const setInfo = (inf) => {
        updateInfo({counter: ++info.counter, message: `${inf} (${info.counter + 1})`});
    };

    const handleClose = () => {
        setOpen(false);
        onClose();
    };

    const handleNormalAdmission = async () => {
        await saveAdmissionEntry(isVisitor ? "VISITOR" : isStaff ? "STAFF" : isStudent ? "STUDENT" : "UNIDENTIFIED", isVisitor ? matchedUser.id_no : isStaff ? matchedUser.employee_no : isStudent ? matchedUser.reg_no : "UNIDENTIFIED", setInfo, setError);
        setInfo("Please allow passage. The user has been verified.");
    }

    const handleProceedWithRegistration = () => {
        setUserDetails({
                ...userDetails,
                fingerprint: `data:image/bmp;base64,${scanData?.BMPBase64}`,
                template: scanData.TemplateBase64
            }
        );
        if (isStudent) navigate(`/newStudent`);
        else if (isStaff) navigate(`/newStaff`);
        else if (isVisitor) navigate(`/newVisitor`);
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        // const uri = isNew || isVisitor ? "https://localhost:8443/SGIFPEnroll" : "https://localhost:8443/SGIFPCapture";
        const uri = isNew || isVisitor ? "https://localhost:8443/SGIFPCapture" : "https://localhost:8443/SGIFPCapture";

        async function scanFingerPrint() {
            setScanning(true);
            fetch(uri, {
                signal: signal,
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "text/plain;charset=UTF-8",
                    "sec-ch-ua": "\"Opera GX\";v=\"83\", \"Chromium\";v=\"97\", \";Not A Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                "referrer": "https://webapi.secugen.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "Timeout=10000&Quality=50&licstr=&fakeDetection=0&templateFormat=ISO&imageWSQRate=2.25",
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
            }).then(async (res) => {
                const data: ScanResult = await res.json();
                if (data.ErrorCode !== 0) {
                    setError("Error Code " + data.ErrorCode + ":  " + errors[data.ErrorCode]);
                    setScanData(undefined);
                } else {
                    setScanData(data);
                    console.log("matching..." + {needle: data.TemplateBase64})
                    setMatchedUser(await fingerprintMatcher(data.TemplateBase64, isStudent? "STUDENT" : isStaff ? "STAFF" : "NA", setError, setInfo) ?? undefined);
                }
            }).catch(error => {
                setError(error);
                setScanData(undefined);
            }).finally(() => {
                setScanning(false);
            });
        }

        async function enrolFingerPrint() {
            setScanning(true);
            fetch(uri, {
                signal: signal,
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.9",
                    "content-type": "text/plain;charset=UTF-8",
                    "sec-ch-ua": "\"Opera GX\";v=\"83\", \"Chromium\";v=\"97\", \";Not A Brand\";v=\"99\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "cross-site"
                },
                "referrer": "https://webapi.secugen.com/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "timeout=10000&quality=40&srvhandle=&FingerPos=LEFT_THUMB",
                "method": "POST",
                "mode": "cors",
                "credentials": "omit"
            }).then(async (res) => {
                const data: EnrolResult = await res.json();
                console.log({data});
                if (data.ErrorCode !== 0) {
                    setError("Error Code " + data.ErrorCode + ":  " + errors[data.ErrorCode]);
                    setScanData(undefined);
                } else {
                    setScanData(data);
                }
            }).catch(error => {
                setError(error);
                setScanData(undefined);
            }).finally(() => {
                setScanning(false);
            });
        }

        if (isVisitor || isNew) {
            // enrolFingerPrint().then(() => {
            // });
            scanFingerPrint().then(() => {
            });
        } else {
            scanFingerPrint().then(() => {
            });
        }

        return () => {
            // cancel the request before component unmounts
            controller.abort();
        };
    }, [refresh]);

    return (
        <div>
            {error.message !== null && <MessageSnackbars message={error.message} color="error"/>}
            {info.message !== null && <MessageSnackbars message={info.message} color="info"/>}
            {/*{(!scanning && !matchedUser) ? <MessageSnackbars message={"This user was not identified."} color="info"/> : ''}*/}
            <Dialog fullWidth open={open} onClose={handleClose}>
                {scanning && <Loading/>}
                <DialogTitle style={{display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                    <b>{(isVisitor || isNew) ? `Enrol new ${isStudent ? "student" : isStaff ? "staff" : "visitor"} fingerprint` : "Verify Fingerprint"}</b>
                    <Button onClick={requestRefresh}>Scan again</Button>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Ask the person to scan their finger on the sensor. A good image should have a quality score of
                        above 50.
                    </DialogContentText>
                    {(!scanning && scanData === undefined && error.message)
                        ?
                        <Typography color={"error"}>
                            {error.message}
                        </Typography> :
                        (!isVisitor && !isNew && !scanning && !matchedUser) ?
                            <Box fullWidth textAlign="center">
                                <Typography color={"error"} variant={"h5"} textTransform="capitalize" fontWeight="bold"
                                            style={{width: "100%"}}>
                                    This user cannot be identified.
                                </Typography>
                            </Box> :
                            ''
                    }
                    <Grid container spacing={1}>
                        <Grid item
                              xs={(isVisitor || isNew) || (!scanning && scanData === undefined) || !matchedUser ? 12 : 2}
                              alignItems="center" justifyContent="center"
                        >
                            <Box p={3} display={"flex"} flexDirection={"column"}>
                                <img className={"finger-scan"}
                                     src={scanning ? defaultImage :
                                         (!scanning && scanData === undefined)
                                             ? scanFailed : ((isVisitor || isNew) && scanData) ? scanSuccessful : !matchedUser ? unknownUser : `data:image/bmp;base64,${scanData?.BMPBase64}`}
                                    // height={scanData?.ImageHeight} width={scanData?.ImageWidth}
                                     style={{/*maxWidth: scanData?.ImageWidth, */
                                         maxHeight: scanData?.ImageHeight,
                                         alignSelf: isVisitor ? "center" : "center"
                                     }}
                                     alt=""/>
                            </Box>
                        </Grid>
                        {!isVisitor && !isNew && !(!scanning && scanData === undefined) && matchedUser ?
                            <Grid item xs={isVisitor ? 0 : 5} display={"flex"} alignContent={"flex-start"}
                                  justifyContent={"center"}>
                                {
                                    (!scanning && typeof scanData?.ImageQuality !== "undefined") &&
                                    <Box mx={1} p={1} display={"flex"} alignItems={"center"} justifyContent={"center"}>
                                        <img className={"identified-person"}
                                             src={matchedUser?.profile_photo}
                                             style={{maxWidth: "100%"}}
                                             alt=""/>
                                    </Box>
                                }
                            </Grid> : ''}
                        {!isVisitor && !isNew && !(!scanning && scanData === undefined) && matchedUser ?
                            <Grid item xs={isVisitor ? 0 : 5} alignContent={"flex-start"} justifyContent={"center"}>
                                {
                                    (!scanning && typeof scanData?.ImageQuality !== "undefined") &&
                                    <Box mx={2} display={"flex"} flexDirection={"column"} alignContent={"flex-start"}
                                         justifyContent={"center"}>
                                        <Typography variant={"overline"}><b>NAME:</b><br/>{matchedUser.name}</Typography>
                                        <Typography variant={"overline"}><b>GENDER:</b><br/>{matchedUser.gender}</Typography>
                                        <Typography variant={"overline"}>
                                            <b>{isStudent ? "REG NO" : "EMPLOYEE NUMBER"}:</b><br/>{isStudent ? matchedUser.reg_no : matchedUser.employee_no}
                                        </Typography>
                                        <Typography variant={"overline"}>
                                            <b>{isStudent ? "COURSE" : "TITLE"}:</b><br/>{isStudent ? matchedUser.course : matchedUser.title}
                                        </Typography>
                                        {isStudent && <Typography variant={"overline"}>
                                            <b>STUDY YEAR:</b><br/>{matchedUser.year}
                                        </Typography>}
                                    </Box>
                                }
                            </Grid> : ''}
                    </Grid>
                    {
                        !scanning &&
                        <Box mx={2} alignContent={"center"} justifyContent={"center"}>
                            <Typography variant={"overline"}><b>Image
                                quality:</b> {scanData?.ImageQuality ?? "UNDEFINED"}
                            </Typography>
                            &nbsp;&nbsp;
                            <Typography variant={"overline"}><b>NFIQ
                                (1-5):</b> {scanData && "NFIQ" in scanData ? scanData?.NFIQ : scanData && "ImageNFIQ" in scanData ? scanData.ImageNFIQ : "undefined"}
                            </Typography>
                            &nbsp;&nbsp;
                            <Typography variant={"overline"}>
                                <b>Image
                                    Size:</b> {((scanData && "WSQImageSize" in scanData ? scanData?.WSQImageSize ?? 0 : NaN) / 1024).toFixed(2)}Kb
                            </Typography>
                        </Box>}
                </DialogContent>
                <DialogActions>
                    <Box mx={3} mb={2}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            variant={"contained"}
                            disabled={(!isVisitor && !isNew && !matchedUser) || (!scanning && scanData === undefined)}
                            onClick={() => {
                                if (isVisitor || isNew) {
                                    handleProceedWithRegistration();
                                } else {
                                    handleNormalAdmission();
                                }
                            }}>
                            {(isVisitor || isNew) ? "Proceed to enter personal details" : "Admit person"}
                        </Button>
                    </Box>

                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ScanDialog;