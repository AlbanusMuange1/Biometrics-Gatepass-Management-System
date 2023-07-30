// @ts-nocheck
import React, {Fragment, useState} from "react";
import {useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable,} from "react-table";
import {Checkbox} from "./Checkbox";
import {CircularProgress} from "@mui/material";
import {BottomNavBar} from "./BottomNavBar";
import {format} from 'date-fns'

const LoadingData = ({message, showProgress = true}) => {
    return (
        <div className={"loading-container"}>
            {showProgress ? <CircularProgress/> : ""}
            <h4 data-testid={"loading-indicator"} className={"loading-indicator"}>
                {message}
            </h4>
        </div>
    );
};

export const GlobalFilter = ({filter, setFilter, type}) => {
    return (
        <div className={"filter-div"}>
      <span>
        Search {type}:{" "}
          <input
              type={"search"}
              value={filter || ""}
              onChange={(e) => {
                  setFilter(e.target.value);
              }}
              data-testid={"search-filter"}
          />
      </span>
        </div>
    );
};


export function getTableColumns(type: string) {
    return type === "students"
        ? [
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Reg number",
                accessor: "reg_no",
            },
            {
                Header: "Gender",
                accessor: "gender",
            },
            {
                Header: "Course",
                accessor: "course",
            },
            {
                Header: "Study year",
                accessor: "year_and_semester",
            },
            {
                Header: "Photo",
                accessor: (user) =>
                    <img src={user.profile_photo} alt={"user_photo"} height={50} width={50} style={{margin: "auto"}}/>,
            },
        ]
        : type === "staff"
            ? [
                {
                    Header: "Name",
                    accessor: "name",
                },
                {
                    Header: "Employee number",
                    accessor: "employee_no",
                },
                {
                    Header: "Title",
                    accessor: "title",
                },
                {
                    Header: "Gender",
                    accessor: "gender",
                },
                {
                    Header: "Photo",
                    accessor: (user) =>
                        <img src={user.profile_photo} alt={"user_photo"} height={50} width={50} style={{margin: "auto"}}/>,
                },
            ] : type === "visitors"
                ? [
                    {
                        Header: "Name",
                        accessor: "name",
                    },
                    {
                        Header: "ID number",
                        accessor: "id_no",
                    },
                    {
                        Header: "Purpose of Visit",
                        accessor: "purpose_of_visit",
                    },
                    {
                        Header: "Gender",
                        accessor: "gender",
                    },
                    {
                        Header: "Date",
                        accessor: (visitor) =>
                            format(new Date(visitor.date_time), "dd/MM/yyyy hh:mm:ss aa"),
                    },
                    {
                        Header: "Photo",
                        accessor: (user) =>
                            <img src={user.profile_photo} alt={"user_photo"} height={50} width={50} style={{margin: "auto"}}/>,
                    },
                ] : type === "entries"
                    ? [
                        {
                            Header: "User type",
                            accessor: "user_type",
                        },
                        {
                            Header: "Identification number",
                            accessor: "identification",
                        },
                        {
                            Header: "Date and time",
                            accessor: (entry) =>
                                format(new Date(entry.date_time), "dd/MM/yyyy hh:mm:ss aa"),
                        },
                        {
                            Header: "Photo",
                            accessor: (user) =>
                                <img src={user.profile_photo} alt={"user_photo"} height={50} width={50} style={{margin: "auto"}}/>,
                        },
                    ]
                    : [
                        {
                            Header: "Select an option above",
                            accessor: "sample_accessor",
                        },
                    ];
}

export function Table({type, columns, data, showAdd}) {
    const [selectedRow, setSelectedRow] = useState("none selected");

    const getSelectedRow = (selectedFlatRow) => {
        return selectedFlatRow.original.name;
    };

    const deleteRow = (selectedFlatRows) => {
        let name = "none selected";

        // if the array is not empty
        if (selectedFlatRows.length > 0) {
            // currently does not support multi-select
            // thus array contains only one  item - index 0
            name = getSelectedRow(selectedFlatRows[0]);
            if (window.confirm("Do you want to delete " + name + "?")) {
                if (type === "students") {
                    // dispatch(deletePartner(name));
                } else {
                    if (type === "staff") {
                        // dispatch(deleteOutlet(name));
                    } else {
                        if (type === "visitors") {
                            // dispatch(deleteCoupon(name));
                        }
                    }
                }
            }
        } else return;
    };

    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
        state,
        setGlobalFilter,
        prepareRow,
        toggleAllRowsSelected,
        selectedFlatRows,
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 0, pageSize: 10},
        },
        useGlobalFilter,
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => {
                return [
                    {
                        id: "selection",
                        Header: ({getToggleAllRowsSelectedProps}) => (
                            <Checkbox {...getToggleAllRowsSelectedProps()} />
                        ),
                        Cell: ({row}) => (
                            <Checkbox {...row.getToggleRowSelectedProps()} />
                        ),
                    },
                    ...columns,
                ];
            });
        }
    );

    const {globalFilter, pageIndex, pageSize} = state;

    // Render the UI for the table

    return (
        <Fragment>
            {/*{type === "students" || type === "staff" || type === "visitors" ? (*/}
            {/*    <ContextMenu selectedItem={selectedRow} type={type.slice(0, -1)}/>*/}
            {/*) : (*/}
            {/*    <></>*/}
            {/*)}*/}
            <div className={"action-bar"}>
                <GlobalFilter
                    filter={globalFilter}
                    setFilter={setGlobalFilter}
                    type={type}
                />
            </div>
            <div className={"table-container"}>
                <div className={"table-holder"}>
                    <table {...getTableProps()}>
                        <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                    >
                                        {column.render("Header")}
                                        <span>
                        {column.isSorted
                            ? column.isSortedDesc
                                ? " ▼"
                                : " ▲"
                            : ""}
                      </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr
                                    {...row.getRowProps()}
                                    className={"tableRow"}
                                    onContextMenu={(e) => {
                                        toggleAllRowsSelected(false);
                                        row.toggleRowSelected(row);

                                        setSelectedRow(
                                            type === "partners"
                                                ? page[i].values.name
                                                : type === "users"
                                                    ? page[i].values.phone_number
                                                    : ""
                                        );
                                    }}
                                >
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                onClick={() => {
                                                    toggleAllRowsSelected(false);
                                                    row.toggleRowSelected(row);

                                                    //make this the selected row for the contextmenu
                                                    setSelectedRow(
                                                        page[i].values.name ?? page[i].values.phone_number
                                                    );
                                                }}
                                            >
                                                {cell.render("Cell")}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    {data.length < 1 ? (
                        <LoadingData
                            message={
                                "I couldn't find any " +
                                type +
                                " on the server. " +
                                "If you're confident that everything's okay then don't fret." +
                                " Add a new one to make this interface more interesting."
                            }
                            showProgress={false}
                        />
                    ) : (
                        ""
                    )}
                </div>

                <BottomNavBar
                    dataSize={data.length}
                    dataType={type}
                    pageIndex={pageIndex}
                    pageOptions={pageOptions}
                    pageSize={pageSize}
                    pageCount={pageCount}
                    setPageSize={setPageSize}
                    gotoPage={gotoPage}
                    previousPage={previousPage}
                    nextPage={nextPage}
                    canPreviousPage={canPreviousPage}
                    canNextPage={canNextPage}
                />
            </div>
        </Fragment>
    );
}

