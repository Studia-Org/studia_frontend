import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { message } from 'antd';

export function extractDataFromSpreadsheet(formValues) {
    const { studentInputColumn, qualificationInputColumn, commentsInputColumn, gradeAverageInputColumn, file } = formValues;

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
                let gradeAverageData = null;
                if (gradeAverageInputColumn) {
                    gradeAverageData = extractColumnData(sheet, gradeAverageInputColumn);
                }

                const dataListFinal = studentData.map((student, index) => ({
                    student,
                    qualification: qualificationData[index],
                    comments: commentsData[index],
                    averageGradePeerReview: gradeAverageData ? gradeAverageData[index] : null

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


export function parseData(activity, studentsDataCSV, students, isPeerReview) {
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
                const set = {
                    group: {
                        students: [],
                        Qualification: studentData.qualification,
                        Comments: studentData.comments
                    }
                }
                if (isPeerReview) {
                    set.group.averageGradePeerReview = studentData.averageGradePeerReview
                }
                data.push(set)
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
                group.qualification = groupExists.attributes?.qualifications?.data
                    .find(qualification => qualification.attributes.activity.data.id === activity.id)
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
                    const set = {
                        key: student.id,
                        Name: { student: student },
                        Qualification: studentData.qualification,
                        Comments: studentData.comments
                    };
                    if (isPeerReview) {
                        set.averageGradePeerReview = studentData.averageGradePeerReview
                    }
                    return set;
                }
                return null;
            })
            .filter(Boolean);
        return data;
    }
}

function calculateAverage(peerReviewAnswers) {
    let sum = 0;
    peerReviewAnswers?.attributes?.PeerReviewAnswers?.data?.forEach(answer => {
        let internAverage = 0
        const Answer = answer?.attributes?.Answers;
        Object.keys(Answer).forEach((value) => {
            const dict = Answer[value];
            internAverage += Object.keys(dict)[0];
        })
        sum += (internAverage / Object.keys(Answer).length);
    });
    if (!peerReviewAnswers) return "No grade yet";
    const average = sum / peerReviewAnswers?.attributes?.PeerReviewAnswers?.data?.length;
    return isNaN(average) ? "-" : average.toFixed(2);
}

export async function createCSVTemplate(activity, students, activities) {
    if (activity === null) {
        message.error('Select an activity');
        return
    }
    const parsedActivityFull = JSON.parse(activity)
    const filteredActivity = activities.find(activity => activity.id === parsedActivityFull.id)

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

        const BeingReviewedBy = filteredActivity?.attributes?.BeingReviewedBy?.data?.id;

        const header = ['Groups', 'Qualification', 'Comments']
        if (parsedActivityFull.isPeerReview) {
            header[1] = 'Professor qualification';
            header.push('Average grade peer review');
        }
        const headerr = worksheet.addRow(header);
        headerr.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5353EC' },
        };
        headerr.eachCell(cell => {
            cell.font = {
                color: { argb: 'FFFFFF' },
            };
        });


        filteredGroups.forEach((group, index) => {
            const row = ["Group " + (index + 1), '"Qualification here"', '"Comments here"']
            if (parsedActivityFull.isPeerReview) {
                const average = calculateAverage(group.attributes.qualifications.data.find(qualification => qualification.attributes.activity.data.id === BeingReviewedBy));
                row.push(average);
            }
            const rowGroup = worksheet.addRow(row);
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
        const header = ['Name', 'Qualification', 'Comments']
        if (parsedActivityFull.isPeerReview) {
            header.push("Average grade peer review");
        }
        const row = worksheet.addRow(header);
        row.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5353EC' },
        };
        row.eachCell(cell => {
            cell.font = {
                color: { argb: 'FFFFFF' },
            };
        });
        const BeingReviewedBy = filteredActivity?.attributes?.BeingReviewedBy?.data?.id;
        students.forEach(student => {
            const average = calculateAverage(student.attributes.qualifications.data.find(qualification => qualification?.attributes?.activity?.data?.id === BeingReviewedBy));

            worksheet.addRow([student.attributes.email, '', '', average]);
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