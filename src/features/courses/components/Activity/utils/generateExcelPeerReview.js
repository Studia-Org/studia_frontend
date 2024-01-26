import * as ExcelJS from 'exceljs';
export default function generateExcelPeerReview(students, peerReviewAnswers) {

    const categories = Object.keys(peerReviewAnswers[0].attributes.Answers);
    const activityName = peerReviewAnswers[0].attributes.qualification.data.attributes.activity.data.attributes.title;
    const transformCategories = (categories) => {
        return categories.map(category => {
            // Puedes ajustar esta lógica según la estructura real de tus datos
            return [
                `Nota ${category}`,
                `Comentario ${category}`
            ];
        });
    };
    const answersKeys = transformCategories(categories);

    const studentQualifications = students.map((student) => {

        const studentQualificationsGiven = peerReviewAnswers.filter((answer) =>
            answer.attributes.user?.data.id === student.id).map((answer) => {
                return {
                    name: answer.attributes.qualification?.data.attributes.user.data.attributes.name,
                    email: answer.attributes.qualification?.data.attributes.user.data.attributes.email,
                    answer: answer.attributes.Answers
                }
            });

        const studentQualificationsReceived = peerReviewAnswers.filter((answer) =>
            answer.attributes.qualification?.data.attributes.user.data.id === student.id).map((answer) => {
                return {
                    name: answer.attributes.user.data.attributes.name,
                    email: answer.attributes.user.data.attributes.email,
                    answer: answer.attributes.Answers
                }
            })

        return {
            name: student.attributes.name,
            email: student.attributes.email,
            qualificationsGiven: studentQualificationsGiven,
            qualificationsReceived: studentQualificationsReceived,
        }
    })

    generateExcel({ categories, answersKeys, studentQualifications, activityName });

}

const generateExcel = async ({ categories, answersKeys, studentQualifications, activityName }) => {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();

    // Agregar una hoja de cálculo por cada estudiante
    studentQualifications.forEach((user, index) => {
        const { name, email, qualificationsReceived, qualificationsGiven } = user;
        // Crear una hoja de cálculo para el estudiante actual
        const sheet = workbook.addWorksheet(`Peer Review ${name}`);
        const rowPeerReviewReceived = sheet.addRow([name + ' peer review received']);
        rowPeerReviewReceived.fill = {
            type: 'pattern',
            pattern: 'solid',
            //color blue
            fgColor: { argb: '5353EC' },
        };
        rowPeerReviewReceived.eachCell(cell => {
            cell.font = {
                color: { argb: 'FFFFFF' },
            };
        });
        const headerRow = sheet.addRow(['Evaluator', 'Email', ...answersKeys.flatMap((key, index) => key)]);
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D3D3D3' },
        };
        qualificationsReceived.forEach((qualification, index) => {
            const row = sheet.addRow([
                qualification.name,
                qualification.email,
                ...categories.flatMap((key, index) => {
                    const answer = qualification.answer[key] || {};
                    const Key = (Object.keys(answer)[0]);
                    return [Key || '', answer[Key] || ''];
                }),
            ]);
            const fillColor = index % 2 === 0 ? 'FFFFFF' : 'D3D3D3';
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: fillColor },
            };
        });

        const rowPeerReviewGiven = sheet.addRow([name + ' peer review given']);
        rowPeerReviewGiven.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5353EC' },
        };
        rowPeerReviewGiven.eachCell(cell => {
            cell.font = {
                color: { argb: 'FFFFFF' },
            };
        });
        const headerRow2 = sheet.addRow(['Evaluated', 'Email', ...answersKeys.flatMap((key, index) => key)]);
        headerRow2.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D3D3D3' },
        };
        qualificationsGiven.forEach((qualification, index) => {
            const row = sheet.addRow([
                qualification.name,
                qualification.email,
                ...categories.flatMap((key, index) => {
                    const answer = qualification.answer[key] || {};
                    const Key = (Object.keys(answer)[0]);
                    return [Key || '', answer[Key] || ''];
                }),
            ]);
            const fillColor = index % 2 === 0 ? 'FFFFFF' : 'D3D3D3';
            row.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: fillColor },
            };
        });

        sheet.columns.forEach(function (column, i) {
            let maxLength = 0;
            column["eachCell"]({ includeEmpty: true }, function (cell) {
                var columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });

    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    console.log(studentQualifications);
    const link = document.createElement('a');
    link.href = url;
    link.download = `peer-review-${activityName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
