//@ts-nocheck
import React, {useEffect, useState} from "react";
import BasePage from "../../components/page";
import Typography from "@mui/material/Typography";
import {getTableColumns, Table} from "../../utils/tables/table_functions";
import {api} from "../../api";
import MessageSnackbars from "../../utils/alerts";
import Loading from "../../utils/loading";
import Box from "@mui/material/Box";
import {IconButton} from "@mui/material";
import {PrintRounded} from "@mui/icons-material";
import {Helmet} from "react-helmet";
import {printEntries, printStaff, printStudents, printVisitors} from "../../utils/reports/ReportGenerator";

function List({ type = "students" }){
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState("none selected");
    const [loading, setLoading] = React.useState(false);
    const [refresh, setRefresh] = React.useState(false);
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

    useEffect(() => {
        async function fetchItems(){
            setLoading(true);
            api().get(`/${type}`)
                .then(response => {
                    const data = response.data;
                    if (data.success){
                        setData(data[type] ?? []);
                    } else {
                        setError(`Could not fetch ${type}. ${data.message ?? ''}`);
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

        fetchItems().then(()=>{})
    }, [refresh]);

    const columns = getTableColumns(type);

    const handlePrint = async () => {
        setLoading(true);
        if (type === "visitors")
            await printVisitors(data);
        else if (type === "students")
            await printStudents(data);
        else if (type === "staff")
            await printStaff(data);
        else if (type === "entries")
            await printEntries(data);

        setLoading(false);
    }

    return(
        <main className={"main"}>
            {error.message !== null && <MessageSnackbars message={error.message} color="error"/>}
            {info.message !== null && <MessageSnackbars message={info.message} color="info"/>}

            <Box display="flex" alignItems="center">
                <Box>
                    <Typography alignContent={"center"} variant={"h5"}>
                        All {type}
                    </Typography>
                </Box>
                <Box ml="auto">
                    <IconButton onClick={handlePrint} disabled={loading}>
                        <PrintRounded/>
                    </IconButton>
                </Box>
            </Box>
            {
                loading ? <Loading />
                    :
                    <Table
                        type={type}
                        data={data}
                        columns={columns}
                        setSelectedRow={setSelectedRow}
                        showAdd={function () {}}
                    />
            }

        </main>
    );
}

export default function ({ type }){
    return <BasePage children={<List type={type} />} />
};