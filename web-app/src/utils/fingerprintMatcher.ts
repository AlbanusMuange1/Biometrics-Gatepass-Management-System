//ts-nocheck
import {api} from "api";
import {errors} from "utils/constants";

interface MatchResult {
    ErrorCode: number,
    MatchingScore: number
}

const MATCHING_THRESHOLD = 50;

export async function fingerprintMatcher(needle, type="STUDENT", onError, onUpdate) {
    let haystack= [];

    async function fetchStudents() {
        await api().get('/students')
            .then(response => {
                const data = response.data;
                if (data.success){
                    haystack.push(...(data.students ?? []));
                } else {
                    onError("Could not fetch students.");
                    return;
                }
            }).catch(error => {
            onError(error);
        })
    }

    async function fetchStaff() {
        await api().get('/staff')
            .then(response => {
                const data = response.data;
                if (data.success){
                    haystack.push(...(data.staff ?? []));
                } else {
                    onError("Could not fetch staff members.");
                    return;
                }
            }).catch(error => {
            onError(error);
        })
    }

    if (type === "STUDENT") await fetchStudents();
    if (type === "STAFF") await fetchStaff();

    console.log("Matching ", type);

    async function checkMatch(print1, print2, threshold) {
        let matches = false;
        await fetch("https://localhost:8443/SGIMatchScore", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "text/plain;charset=UTF-8",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"99\", \"Google Chrome\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site"
            },
            "referrer": "https://webapi.secugen.com/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": `template1=${print1.toString()}&template2=${print2.toString()}&licstr=&templateFormat=ISO`,
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        }).then(async response => {
            const data: MatchResult = await response.json();
            console.log({print1, print2});
            console.log({data});
            if (data.ErrorCode !== 0) {
                onError("Error Code " + data.ErrorCode + ":  " + errors[data.ErrorCode]);
                return false;
            } else {
                const { MatchingScore } = data;
                matches = MatchingScore >= threshold;
            }
        }).catch(err => {
            onError(err);
            return false;
        });

        // await fetch("https://localhost:8443/SGIMatchScore", {
        //     "headers": {
        //         "accept": "*/*",
        //         "accept-language": "en-US,en;q=0.9",
        //         "content-type": "text/plain;charset=UTF-8",
        //         "sec-ch-ua": "\"Opera GX\";v=\"83\", \"Chromium\";v=\"97\", \";Not A Brand\";v=\"99\"",
        //         "sec-ch-ua-mobile": "?0",
        //         "sec-ch-ua-platform": "\"Windows\"",
        //         "sec-fetch-dest": "empty",
        //         "sec-fetch-mode": "cors",
        //         "sec-fetch-site": "cross-site",
        //         "Referer": "https://webapi.secugen.com/",
        //         "origin": "https://webapi.secugen.com/",
        //     },
        //     "body": `template1=${print1}&template2=${print2}`,
        //     "method": "POST"
        // }).then(async response => {
        //     const data: MatchResult = await response.json();
        //     console.log({print1, print2});
        //     console.log({data});
        //     if (data.ErrorCode !== 0) {
        //         onError("Error Code " + data.ErrorCode + ":  " + errors[data.ErrorCode]);
        //         return false;
        //     } else {
        //         const { MatchingScore } = data;
        //         matches = MatchingScore >= threshold;
        //     }
        // }).catch(err => {
        //     onError(err);
        //     return false;
        // });
        return matches;
    }

    let matches= false, student = null;
    for (const item of haystack) {
        if (await checkMatch(needle, item.fingerprint.toString(), MATCHING_THRESHOLD)) {
            matches = true;
            student = item;
            break;
        }
        console.log({index: haystack.indexOf(item), matches})
    }

    if (matches)
        return student;
    else return null;
}