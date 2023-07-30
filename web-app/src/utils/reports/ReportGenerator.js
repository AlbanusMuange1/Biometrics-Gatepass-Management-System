//@ts-nocheck
import jsPDF from "jspdf";
import "jspdf-autotable";

import {errorToaster, successToaster} from "./Toaster";
import {capitalize} from "@mui/material";
import {format} from "date-fns";

export async function printStudents(students) {
    // title, type, rows, columns
    let columns = ["Name", "Reg Number", "Gender", "Course", "Study year", "Photo"];
    let rows = [];
    students.forEach((student) => {
        rows.push([student.name, student.reg_no, student.gender, student.course, student.year_and_semester, student.profile_photo]);
    });

    await generatePDF(capitalize("All students"), rows, columns, "p");
}

export async function printStaff(staff) {
    // title, type, rows, columns
    let columns = ["Name", "Employee Number", "Gender", "Title", "Photo"];
    let rows = [];
    staff.forEach((member) => {
        rows.push([member.name, member.employee_no, member.gender, member.title, member.profile_photo]);
    });

    await generatePDF(capitalize("All staff"), rows, columns, "p");
}

export async function printVisitors(visitors) {
    // title, type, rows, columns
    let columns = ["Name", "ID Number", "Gender", "Purpose of visit", "Date & Time", "Photo"];
    let rows = [];
    visitors.forEach((visitor) => {
        console.log(visitor.id_no)
        rows.push([visitor.name, visitor.id_no, visitor.gender, visitor.purpose_of_visit, format(new Date(visitor.date_time), "dd/MM/yyyy hh:mm:ss aa"), visitor.profile_photo]);
    });

    await generatePDF(capitalize("All visitors"), rows, columns, "p");
}

export async function printEntries(entries) {
    // title, type, rows, columns
    let columns = ["User type", "Identification Number", "Date & Time", "Photo"];
    let rows = [];
    entries.forEach((entry) => {
        rows.push([entry.user_type, entry.identification, format(new Date(entry.date_time), "dd/MM/yyyy hh:mm:ss aa"), entry.profile_photo]);
    });

    await generatePDF(capitalize("All entries"), rows, columns, "p");
}


// define a generatePDF function that accepts a tickets argument
const generatePDF = async (type, rows, columns, orientation) => {
    // initialize jsPDF
    const doc = new jsPDF({
        orientation: orientation,
        unit: "px",
        format: "a4",
        putOnlyUsedFonts: true
    });

    // define an empty array of rows
    const tableColumn = [...columns];
    const tableRows = [...rows];

    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

    const commonText = `This is a list of ${type}. Generated on ${format(
        new Date(),
        "dd/MM/yyyy"
    )} at ${format(
        new Date(),
        "hh:mm:ss a"
    )}`;
    const footerText = `${date}`;

    let pageSize = doc.internal.pageSize;
    let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

    // report title. and margin-top + margin-left
    doc.setFontSize(20);
    doc.setFont("Helvetica", "bold");
    doc.text("Gatepass Management System", 30, 22);
    // doc.text(title, 14, 30);
    doc.setFontSize(16);
    doc.text(doc.splitTextToSize(type, pageWidth - 35, {}), 30, 40);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    pageSize = doc.internal.pageSize;
    pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    doc.setFont("Helvetica", "normal");
    let text = doc.splitTextToSize(commonText, pageWidth - 35, {});
    doc.text(text, 30, 60);

    if (tableRows.length < 1) {
        errorToaster("There's no data. Add some data first, before trying to export.");
        return;
    }

    // load images
    const imgElements = rows.map(row => row[row.length-1]);

    // startY is basically margin-top
    doc.autoTable(
        {
            columns:tableColumn,
            body: tableRows,
            startY: 80,
            showHead: "firstPage",
            didParseCell: function(data) {
                if (data.section === 'body'  && (data.column.index === tableColumn.length - 1)){
                    console.log({data});
                    data.cell.raw  = '';
                    data.cell.text  = [''];
                    data.cell.styles.minCellHeight = 60;
                    data.cell.styles.minCellWidth = 60;
                }
                data.cell.styles.valign = "middle";
            },
            didDrawCell: function(data) {
                if (data.section === 'body'  && (data.column.index === tableColumn.length - 1)){
                    console.log({data});
                    const img = imgElements[data.row.index];
                    doc.addImage(img, data.cell.x + 5, data.cell.y + 5, 50, 50);
                }
            },
        }
    );

    //footer
    doc.setFontSize(11);
    doc.text(footerText, 30, doc.lastAutoTable.finalY + 30);

    // we define the name of our PDF file.
    doc.save(`GATEPASS_SYSTEM_${type.toUpperCase()}_Report_${dateStr}.pdf`);

    successToaster(`Your ${type} data has been successfully exported to pdf.`);
};

export default generatePDF;