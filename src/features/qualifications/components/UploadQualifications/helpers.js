import { message } from 'antd';
import Papa from 'papaparse';

export function extractDataFromCSV(formValues) {
    const { studentInputColumn, qualificationInputColumn, commentsInputColumn, file } = formValues;



    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: function (results) {
                const dataListFinal = [];
                const rows = results.data;
                const studentColumnLetter = studentInputColumn.charAt(0);
                const studentRowStart = parseInt(studentInputColumn.substring(1), 10);
                const studentRowEnd = parseInt((studentInputColumn.split('-')[1]).substring(1), 10);

                if (rows.length < studentRowEnd) {
                    message.error('El archivo CSV no contiene suficientes filas');
                    reject('El archivo CSV no contiene suficientes filas');
                    return;
                }

                const studentColumnIndex = getColumnIndex(studentColumnLetter)
                const dataListStudent = [];

                for (let i = studentRowStart; i <= studentRowEnd; i++) {
                    const student = rows[i][studentColumnIndex];
                    dataListStudent.push(student);
                }

                const dataListQualifications = [];
                const qualificationColumnLetter = qualificationInputColumn.charAt(0);
                const qualificationColumnIndex = getColumnIndex(qualificationColumnLetter);
                const qualificationRowStart = parseInt(qualificationInputColumn.substring(1), 10);
                const qualificationRowEnd = parseInt((qualificationInputColumn.split('-')[1]).substring(1), 10);

                if (rows.length < qualificationRowEnd) {
                    message.error('El archivo CSV no contiene suficientes filas');
                    reject('El archivo CSV no contiene suficientes filas');
                    return;
                }

                for (let i = qualificationRowStart; i <= qualificationRowEnd; i++) {
                    const qualification = rows[i][qualificationColumnIndex];
                    dataListQualifications.push(qualification);
                }


                const dataListComments = [];
                const commentsColumnLetter = commentsInputColumn.charAt(0);
                const commentsColumnIndex = getColumnIndex(commentsColumnLetter);
                const commentsRowStart = parseInt(commentsInputColumn.substring(1), 10);
                const commentsRowEnd = parseInt((commentsInputColumn.split('-')[1]).substring(1), 10);

                if (rows.length < commentsRowEnd) {
                    message.error('El archivo CSV no contiene suficientes filas');
                    reject('El archivo CSV no contiene suficientes filas');
                    return;
                }
                for (let i = commentsRowStart; i <= commentsRowEnd; i++) {
                    const comment = rows[i][commentsColumnIndex];
                    dataListComments.push(comment);
                }


                for (let i = 0; i < dataListStudent.length; i++) {
                    dataListFinal.push({
                        student: dataListStudent[i],
                        qualification: dataListQualifications[i],
                        comments: dataListComments[i]
                    });
                }
                
                resolve(dataListFinal);
            },
        });
    });

    function getColumnIndex(columnLetter) {
        const columnIndex = columnLetter.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
        if (columnIndex < 0 || columnIndex >= 26) {
            return -1;
        }

        return columnIndex;
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