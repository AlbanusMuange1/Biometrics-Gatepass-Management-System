//@ts-nocheck
import {createContext, useState} from 'react';

//create a context, with createContext api
export const userDetailsContext = createContext();

export interface StudentData {
    name?: string,
    regNo?: string,
    gender?: "M" | "F",
    photo?: string,
    fingerprint?: string,
    course?: string,
    year_and_semester?: string,
}

export interface StaffData {
    name?: string,
    employeeNUmber?: string,
    title?: string,
    gender?: "M" | "F";
    photo?: string,
    fingerprint?: string,
}

export interface VisitorData {
    name?: string,
    identificationNUmber?: string,
    purposeOfVisit?: string,
    gender?: "M" | "F";
    photo?: string,
    fingerprint?: string,
}

export type UserType = "STUDENT" | "STAFF";

const UserDetailsProvider = (props) => {
    const [userDetails, setUserDetails] = useState<StudentData>(undefined);
    const [visitorDetails, setVisitorDetails] = useState(undefined);

    return (
        <userDetailsContext.Provider value={[userDetails, setUserDetails, visitorDetails, setVisitorDetails]}>
            {props.children}
        </userDetailsContext.Provider>
    );
};

export default UserDetailsProvider;