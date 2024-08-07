import * as ExcelJS from 'exceljs';

export async function createExcel(studentsData, activityName) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Responses');
    // Agregar encabezados
    worksheet.columns = [
        { header: 'Student email', key: 'Studentemail', width: 30 },
        { header: 'Student Name', key: 'studentName', width: 30 },
        { header: 'Question Id', key: 'questionId', width: 15 },
        { header: 'Question', key: 'question', width: 50 },
        { header: 'Answer', key: 'answer', width: 100 }
    ];
    worksheet.columns.forEach(column => {
        column.alignment = { wrapText: true, horizontal: 'left' };
    });
    studentsData.forEach(student => {
        const responses = student.attributes.responses.responses;
        const name = student.attributes.user.data.attributes.name;
        const email = student.attributes.user.data.attributes.email;
        responses.forEach((response, index) => {
            if (index === 0) {
                const row = worksheet.addRow({
                    Studentemail: email,
                    studentName: name,
                    questionId: "Question Id",
                    question: "Questions",
                    answer: "Answers"
                });
                row.eachCell((cell, colNumber) => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFD9EAD3' }
                    };
                });
            }
            worksheet.addRow({
                Studentemail: "",
                studentName: "",
                questionId: index + 1,
                question: response.question,
                answer: response.answer
            });

        });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activityName}_responses.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}