//@ts-nocheck
import React, {useContext, useState} from "react";
import {StaffData, StudentData, userDetailsContext, VisitorData} from "../context";
import {Form, useForm} from "utils/useForm";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Controls from "utils/Controls/Controls";
import Button from "@mui/material/Button";
import BasePage from "../components/page";
import {api} from "../api";
import {UploadFilesService} from "../upload/upload-images.service";
import Loading from "../utils/loading";
import {useNavigate} from "react-router-dom";
import MessageSnackbars from "../utils/alerts";
import {saveAdmissionEntry} from "./dialogs/scanDialog";
import {Helmet} from "react-helmet";

export const ROLES = [
    "STUDENT",
    "LECTURER",
    "STAFF",
];

const initialStudentValues = {
    name: '',
    regNo: '',
    photo: '',
    fingerprint: '',
    course: '',
    year_and_semester: '',
};

const initialStaffValues = {
    name: '',
    employeeNUmber: '',
    title: '',
    gender: '',
    photo: '',
    fingerprint: '',
};

const initialVisitorValues = {
    name: '',
    identificationNUmber: '',
    purposeOfVisit: '',
    gender: '',
    photo: '',
    fingerprint: '',
};


function NewUser({userType}) {
    const validate = (fieldValues = values) => {
        let temp: StudentData | StaffData | VisitorData = {...errors};
        // let temp = {};
        if (userType === "STUDENT") {
            if ("name" in fieldValues)
                temp.name =
                    fieldValues.name ? "" : "This field is required. Enter the student's name.";
            if ("regNo" in fieldValues)
                temp.regNo =
                    fieldValues.regNo ? "" : "This field is required. Enter the student's registration number.";
            if ("course" in fieldValues)
                temp.course =
                    fieldValues.course ? "" : "This field is required. Enter the student's course.";
            if ("year_and_semester" in fieldValues)
                temp.year_and_semester =
                    fieldValues.year_and_semester ? "" : "This field is required. Enter the student's year and semester, e.g. 4.2.";
        } else if (userType === "STAFF") {
            if ("name" in fieldValues)
                temp.name =
                    fieldValues.name ? "" : "This field is required. Enter the staff member's name.";
            if ("title" in fieldValues)
                temp.title =
                    fieldValues.title ? "" : "This field is required. Enter the staff member's title.";
            if ("employeeNumber" in fieldValues)
                temp.employeeNumber =
                    fieldValues.employeeNumber ? "" : "This field is required. Enter the staff member's employee number.";
            if ("gender" in fieldValues)
                temp.gender =
                    fieldValues.gender ? "" : "This field is required. Enter the staff member's employee gender.";
        } else if (userType === "VISITOR") {
            if ("name" in fieldValues)
                temp.name =
                    fieldValues.name ? "" : "This field is required. Enter the visitor's name.";
            if ("purposeOfVisit" in fieldValues)
                temp.purposeOfVisit =
                    fieldValues.purposeOfVisit ? "" : "This field is required. Enter the visitor's purpose of visit.";
            if ("identificationNumber" in fieldValues)
                temp.identificationNumber =
                    fieldValues.identificationNumber ? "" : "This field is required. Enter the visitor's identification number.";
            if ("gender" in fieldValues)
                temp.gender =
                    fieldValues.gender ? "" : "This field is required. Enter the visitor's employee gender.";
        }
        setErrors({
            ...temp,
        });
        if (fieldValues === values) return Object.values(temp).every((x) => x === "");
    };
    const {values, setValues, errors, setErrors, handleInputChange, resetForm} = useForm(
        initialStudentValues,
        true,
        validate
    );
    let navigate = useNavigate();
    const [userDetails, setUserDetails] = useContext(userDetailsContext);
    const [uploadError, setUploadError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePhoto, setImagePhoto] = useState('');
    const [imagePhotoLink, setImagePhotoLink] = useState<string>(undefined);
    const [imagePreview, setImagePreview] = useState('');
    // Page errors and info toasts
    const [error, updateError] = useState({counter: 0, message: null});
    const [info, updateInfo] = useState({counter: 0, message: null});

    const setError = (err) => {
        updateError({counter: ++error.counter, message: `${err} (${error.counter + 1})`});
    };

    const setInfo = (inf) => {
        updateInfo({counter: ++info.counter, message: `${inf} (${info.counter + 1})`});
    };

    const handleClose = () => {
        setShowScanDialog(false);
    }

    const handleClearForm = () => {
        // TODO: Clear any state
        resetForm();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            // TODO: Process data upload to server
            resetForm();
        } else {
            console.log("could not validate");
        }
    };

    const selectFile = (event) => {
        const file = event.target.files[0];
        console.log(file);
        // setUserDetails({...userDetails, photo: `data:image/bmp;base64,${scanData?.BMPBase64}`});
        setImagePhoto(file);
        setImagePreview(URL.createObjectURL(file))
    };

    async function handleUpload(){
        setUploading(true);
        await UploadFilesService.upload(
            setLoading, imagePhoto, (error, result) => {
                console.log(error, result);
                if (error) {
                    setError(error);
                } else {
                    setImagePhotoLink(result.url);
                    setInfo("Upload successful.");
                }
                setUploading(false);
                setLoading(false);
            }
        );
    }

    const handleAddUser = async () => {
        if(!userDetails?.template){
            setError("Please scan a fingerprint.");
            return;
        }
        if (userType === "STUDENT")
            await handleAddStudent();
        else if (userType === "STAFF")
            await handleAddStaff();
        else if (userType === "VISITOR")
            await handleAddVisitor();
    }

    const handleAddStudent = async () => {
        setLoading(true);
        if (validate()) {
            await api().post(
                '/students',
                {
                    "name": values.name,
                    "reg_no": values.regNo,
                    "gender": values.gender,
                    "course": values.course,
                    "year_and_semester": values.year_and_semester,
                    "profile_photo": imagePhotoLink,
                    "fingerprint": userDetails.template
                }
            ).then(response => {
                const data = response.data;
                if (data.success){
                    resetForm();
                    setUserDetails({});
                    setImagePhotoLink(undefined);
                    setInfo(data.message ?? "Student was added successfully.");
                } else {
                    setError(data.message);
                }
            }).catch(error => {
                if(error.response){
                    const data = error.response.data;
                    console.log(data);
                    setError(data.message);
                }
            })
        }
        setLoading(false);
    }

    const handleAddStaff = async () => {
        console.log("Will add staff member");
        setLoading(true);
        if (validate()) {
            await api().post(
                '/staff',
                {
                    "name": values.name,
                    "employee_no": values.employeeNumber,
                    "title": values.title,
                    "gender": values.gender,
                    "profile_photo": imagePhotoLink,
                    "fingerprint": userDetails.template
                }
            ).then(response => {
                const data = response.data;
                if (data.success){
                    resetForm();
                    setUserDetails({});
                    setImagePhotoLink(undefined);
                    setInfo(data.message ?? "Staff member was added successfully.");
                } else {
                    setError(data.message);
                }
            }).catch(error => {
                if(error.response){
                    const data = error.response.data;
                    console.log(data);
                    setError(data.message);
                }
            })
        }else {
            console.log(errors);
            console.log(validate());
        }
        setLoading(false);
    }

    const handleAddVisitor = async () => {
        console.log("Will add visitor");
        setLoading(true);
        if (validate()) {
            await api().post(
                '/visitors',
                {
                    "name": values.name,
                    "id_no": values.identificationNumber,
                    "purpose_of_visit": values.purposeOfVisit,
                    "gender": values.gender,
                    "profile_photo": imagePhotoLink,
                    "fingerprint": userDetails.template
                }
            ).then(async response => {
                const data = response.data;
                if (data.success) {
                    resetForm();
                    setUserDetails({});
                    setImagePhotoLink(undefined);
                    setInfo(data.message ?? "Visitor was added successfully.");
                    // Move to gatepass page
                    await saveAdmissionEntry("VISITOR", data.visitor?.id_no ?? "UNIDENTIFIED", setInfo, setError);
                    console.log("about to nav")
                    navigate(`/gatepass?type=visitor&id=${data['visitor']?.id ?? 0}`)
                } else {
                    setError(data.message);
                }
            }).catch(error => {
                if(error.response){
                    const data = error.response.data;
                    console.log(data);
                    setError(data.message);
                }
            })
        }
        setLoading(false);
    }

    return (
        <main className={"main"}>
            <Helmet>
                <meta charSet="utf-8" />
                <title>New User - Gatepass Management System</title>
            </Helmet>
            <Box my={2} p={1}>
                {error.message !== null && <MessageSnackbars message={error.message} color="error"/>}
                {info.message !== null && <MessageSnackbars message={info.message} color="info"/>}
                <Typography alignContent={"center"} variant={"h5"} fontWeight="bold">
                    New {userType.toLowerCase()}
                </Typography>
                { !userDetails?.template &&
                    <Box mt={2} fullWidth textAlign="center">
                        <Typography color={"error"} variant={'h6'} fontWeight="bold">
                            Please go back an scan a fingerprint.
                        </Typography>
                    </Box>

                }
                {loading || uploading ? <Loading/> : ''}
                <Box mt={3}>
                    <Form>
                        <Grid container>
                            <Grid item xs={6}>
                                <Controls.Input
                                    label="Name"
                                    name="name"
                                    value={values.name}
                                    onChange={handleInputChange}
                                    error={errors.name}
                                />

                                <Controls.Input
                                    label={userType === "STUDENT" ? "Registration number" : userType === "VISITOR" ? "Identification Number" : "Employee Number"}
                                    name={userType === "STUDENT" ? "regNo" : userType === "VISITOR" ? "identificationNumber" : "employeeNumber"}
                                    value={userType === "STUDENT" ? values.regNo : userType === "VISITOR" ? values.identificationNumber : values.employeeNumber}
                                    onChange={handleInputChange}
                                    error={userType === "STUDENT" ? errors.regNo : userType === "VISITOR" ? errors.identificationNumber : errors.employeeNumber}
                                />

                                <Controls.Input
                                    label={userType === "STUDENT" ? "Course" : userType === "VISITOR" ? "Purpose of Visit" : "Title"}
                                    name={userType === "STUDENT" ? "course" : userType === "VISITOR" ? "purposeOfVisit" : "title"}
                                    value={userType === "STUDENT" ? values.course : userType === "VISITOR" ? values.purposeOfVisit : values.title}
                                    onChange={handleInputChange}
                                    error={userType === "STUDENT" ? errors.course : userType === "VISITOR" ? errors.purposeOfVisit : errors.title}
                                    {...(userType === "VISITOR" && {multiline: true, rows: 3})}
                                />

                            </Grid>
                            <Grid item xs={6}>
                                <Controls.Select
                                    name="gender"
                                    label="Gender"
                                    value={values.gender ?? ""}
                                    options={[{id: "F", name: "Female"}, {id: "M", name: "Male"}]}
                                    onChange={handleInputChange}
                                    error={errors.gender}
                                />

                                {
                                    userType === "STUDENT" &&
                                    <Controls.Input
                                        label="Year and semester, e.g. 4.2"
                                        name="year_and_semester"
                                        value={values.year_amd_semester}
                                        onChange={handleInputChange}
                                        error={errors.year_and_semester}
                                        style={userType === "STAFF" ? {display: "none"} : {}}
                                    />}
                                <div className="mg20">
                                    <label htmlFor="btn-upload">
                                        <input
                                            id="btn-upload"
                                            name="btn-upload"
                                            style={{display: "none"}}
                                            type="file"
                                            accept="image/*"
                                            onChange={selectFile}
                                            disabled={loading}
                                        />
                                        <Box mb={2}>
                                            <Button
                                                className="btn-choose"
                                                variant="contained"
                                                color={"info"}
                                                // style={{ color: "white" }}
                                                component="span"
                                            >
                                                Choose Image
                                            </Button>
                                        </Box>
                                    </label>
                                    <div
                                        className="file-name"
                                        style={{display: "flex", flexDirection: "column"}}
                                    >
                                        {imagePhoto
                                            ? <Typography
                                                py={1}
                                                variant="caption"
                                                fontWeight="small"
                                                sx={{fontWeight: "light", fontStyle: "italic"}}
                                            >
                                                {imagePhoto.name}
                                            </Typography>
                                            : null}
                                    </div>
                                    <Box mb={2}>
                                        <Button
                                            className="btn-upload"
                                            variant="contained"
                                            color="warning"
                                            // style={{ color: "white" }}
                                            component="span"
                                            disabled={!imagePhoto}
                                            onClick={() => {
                                                handleUpload();
                                            }}
                                        >
                                            Upload
                                        </Button>
                                    </Box>
                                    <Box display="flex" flexDirection="column" py={1}>
                                        {uploading && (
                                            <Typography
                                                variant="text"
                                                fontSize={"medium"}
                                                className={`upload-message ${error.message ? "error" : ""}`}
                                            >
                                                Uploading
                                            </Typography>
                                        )}
                                    </Box>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                {imagePreview && (
                                    <Box display="flex" flexDirection="column">
                                        <Typography
                                            variant="overline"
                                            fontSize={"medium"}
                                            fontWeight={"bold"}
                                            className={`upload-message ${uploadError ? "error" : ""}`}
                                        >
                                            Selected images:
                                        </Typography>
                                        <div
                                            style={{
                                                display: "flex",
                                                flexFlow: "row wrap",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}
                                        >
                                            <img key={imagePhoto.name} className="preview my20" src={imagePreview}
                                                 alt=""/>
                                            <img key={'fingerprint'} className="preview my20"
                                                 src={userDetails?.fingerprint ?? ''} alt=""/>
                                        </div>
                                    </Box>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <Button onClick={handleAddUser}
                                        disabled={!imagePhotoLink || loading || uploading}
                                        variant={"contained"}>Add {userType.toLowerCase()}</Button>
                            </Grid>
                        </Grid>
                    </Form>
                </Box>
            </Box>
        </main>
    );
}

export default function ({userType}) {
    return <BasePage children={<NewUser userType={userType}/>}/>
};