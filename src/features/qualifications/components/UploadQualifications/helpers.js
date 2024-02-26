import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { message } from 'antd';

export function extractDataFromSpreadsheet(formValues) {
    const { studentInputColumn, qualificationInputColumn, commentsInputColumn, file } = formValues;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const data = e.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                const studentData = extractColumnData(sheet, studentInputColumn);
                const qualificationData = extractColumnData(sheet, qualificationInputColumn);
                const commentsData = extractColumnData(sheet, commentsInputColumn);

                const dataListFinal = studentData.map((student, index) => ({
                    student,
                    qualification: qualificationData[index],
                    comments: commentsData[index]
                }));

                resolve(dataListFinal);
            } catch (error) {
                console.error('Error parsing spreadsheet:', error);
                reject('Error parsing spreadsheet');
            }
        };

        reader.readAsBinaryString(file);
    });

    function extractColumnData(sheet, inputColumn) {
        const cellRange = XLSX.utils.decode_range(sheet['!ref']);
        const columnLetter = inputColumn.charAt(0);
        const columnIndex = getColumnIndex(columnLetter);

        const startRow = parseInt(inputColumn.substring(1), 10);
        const endRow = parseInt((inputColumn.split('-')[1]).substring(1), 10);

        const data = [];

        for (let row = startRow; row <= endRow; row++) {
            const cellAddress = { c: columnIndex, r: row };
            const cellValue = sheet[XLSX.utils.encode_cell(cellAddress)];
            data.push(cellValue ? cellValue.v : null);
        }

        return data;
    }

    function getColumnIndex(columnLetter) {
        return columnLetter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
    }
}


export function parseData(activity, studentsDataCSV, students) {
    if (activity === null) {
        message.error('Select an activity');
        return
    }

    if (activity.groupActivity) {
        const data = []
        const AllFilteredGroups = students.filter((student) => student.attributes.groups?.data
            .find(group => group.attributes.activity?.data?.id === activity.id))
            .map((group) => group.attributes.groups.data.find(group => group.attributes.activity?.data?.id === activity.id))

        const filteredGroupsIds = AllFilteredGroups.map(group => group.id)
        const filteredGroupsIdsUnique = [...new Set(filteredGroupsIds)]
        const filteredGroups = filteredGroupsIdsUnique.map(id => AllFilteredGroups.find(group => group.id === id))

        studentsDataCSV.forEach((studentData, index) => {
            if (studentData.student !== null && studentData.student.includes('Group')) {
                data.push({
                    group: {
                        students: [],
                        Qualification: studentData.qualification,
                        Comments: studentData.comments
                    }
                }
                )
            }
            else {
                const student = students.find(student => student.attributes.name === studentData.student);
                if (student) {
                    data[data.length - 1].group.students.push({ student: student })
                }
            }
            return null;
        })
        //check if groups exist

        data.forEach(({ group }, index) => {
            //compare if groups from data are in filteredgroups
            const groupExists = filteredGroups.find(filteredGroup => filteredGroup.attributes.users.data.every(user => group.students.find(student => student.student.id === user.id)))
            if (groupExists) {
                group.id = groupExists.id
                group.qualification = groupExists.attributes?.qualification
            }
            else {
                group.id = null
            }
        })

        //delete those that don't exist
        data.forEach((group, index) => {
            if (group.id === null) {
                data.splice(index, 1)
            }
        })

        return data;
    }
    else {
        const data = studentsDataCSV
            .map(studentData => {
                const student = students.find(student => student.attributes.email === studentData.student);
                if (student) {
                    return {
                        key: student.id,
                        Name: { student: student },
                        Qualification: studentData.qualification,
                        Comments: studentData.comments
                    };
                }
                return null;
            })
            .filter(Boolean);
        return data;
    }
}



export async function createCSVTemplate(activity, students) {
    if (activity === null) {
        message.error('Select an activity');
        return
    }
    const parsedActivityFull = JSON.parse(activity)

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Uptitude';
    workbook.created = new Date();
    workbook.modified = new Date();

    const worksheet = workbook.addWorksheet('Sheet 1');

    if (parsedActivityFull.groupActivity) {

        const AllFilteredGroups = students.filter((student) => student.attributes.groups?.data
            .find(group => group.attributes.activity?.data?.id === parsedActivityFull.id))
            .map((group) => group.attributes.groups.data.find(group => group.attributes.activity?.data?.id === parsedActivityFull.id))

        const filteredGroupsIds = AllFilteredGroups.map(group => group.id)
        const filteredGroupsIdsUnique = [...new Set(filteredGroupsIds)]
        const filteredGroups = filteredGroupsIdsUnique.map(id => AllFilteredGroups.find(group => group.id === id))

        worksheet.addRow(['Groups', 'Qualification', 'Comments']);

        filteredGroups.forEach((group, index) => {
            const rowGroup = worksheet.addRow(["Group " + (index + 1), '"Qualification here"', '"Comments here"']);
            rowGroup.font = { bold: true };
            rowGroup.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD9D9D9' }
            };
            group.attributes.users.data.forEach(user => {
                worksheet.addRow([user.attributes.name, user.attributes.email, '']);
            });
        });

    }
    else {
        worksheet.addRow(['Name', 'Qualification', 'Comments']);
        students.forEach(student => {
            worksheet.addRow([student.attributes.email, '', '']);
        });
    }

    worksheet.columns.forEach(function (column, i) {
        let maxLength = 0;
        column["eachCell"]({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 20;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `template-${parsedActivityFull.title}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}