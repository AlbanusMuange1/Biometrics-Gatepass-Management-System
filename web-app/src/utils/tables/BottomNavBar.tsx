import React from "react";

interface PaginationOptions {
    dataSize: number;
    dataType: string;
    pageIndex: number;
    pageOptions;
    pageSize;
    pageCount;
    setPageSize;
    gotoPage;
    previousPage;
    nextPage;
    canPreviousPage;
    canNextPage;
}

export const BottomNavBar = (props: PaginationOptions) => {
    return (
        <div className={"bottom-nav"}>
            {props.dataType === "all_coupons" || props.dataType === "monthly_coupons" || props.dataType === "date-filter" ? <h4>Total: {props.dataSize}</h4> : ""}
            <div>
        <span data-testid={"page-x-of-y"}>
          Page{" "}
            <strong>
            {props.pageIndex + 1} of {props.pageOptions.length}
          </strong>{" "}
        </span>
                <span className={"nav-button"}>
          Go to page{" "}
                    <input
                        type={"number"}
                        defaultValue={props.pageIndex + 1}
                        onChange={(e) => {
                            const pageNumber = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            props.gotoPage(pageNumber);
                        }}
                        style={{ width: "50px" }}
                        data-testid={"go-to-page-x"}
                    />
        </span>
                <select
                    value={props.pageSize}
                    onChange={(e) => {
                        props.setPageSize(Number(e.target.value));
                    }}
                    data-testid={"set-pagesize"}
                >
                    {[5, 10, 15, 25, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div className={"btns"}>
                <button
                    onClick={() => props.gotoPage(0)}
                    className={"nav-button"}
                    disabled={!props.canPreviousPage}
                >
                    {"<<"}
                </button>

                <button
                    onClick={() => props.previousPage()}
                    className={"nav-button"}
                    disabled={!props.canPreviousPage}
                >
                    Previous Page
                </button>
                <button
                    onClick={() => props.nextPage()}
                    className={"nav-button"}
                    disabled={!props.canNextPage}
                >
                    Next Page
                </button>

                <button
                    onClick={() => props.gotoPage(props.pageCount - 1)}
                    className={"nav-button"}
                    disabled={!props.canNextPage}
                >
                    {">>"}
                </button>
            </div>
        </div>
    );
};
