import * as XLSX from 'xlsx';


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


export function parseData(studentsDataCSV, students) {
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