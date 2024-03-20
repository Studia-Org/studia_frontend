import * as ExcelJS from 'exceljs';
export default function generateExcelPeerReview(students, peerReviewAnswers, activityToReviewID, peerReviewinGroups) {

    const categories = Object.keys(peerReviewAnswers[0].attributes.Answers);
    const activityName = peerReviewAnswers[0].attributes.qualifications.data[0].attributes.activity.data.attributes.title;
    const transformCategories = (categories) => {
        return categories.map(category => {
            return [
                `Score: ${category}`,
                `Comments: ${category}`
            ];
        });
    };


    const answersKeys = transformCategories(categories);
    let { studentQualifications, maximumStudentsPerGroup, activityGroup } = peerReviewinGroups ?
        getStudentQualificationsPeerInGroups(students, peerReviewAnswers, activityToReviewID) :
        getStudentQualificationsNotPeerInGroups(students, peerReviewAnswers, peerReviewinGroups, activityToReviewID);

    maximumStudentsPerGroup = peerReviewinGroups ? maximumStudentsPerGroup : maximumStudentsPerGroup - 1;
    console.log({ studentQualifications })
    generateExcel({ categories, answersKeys, studentQualifications, activityName, activityGroup, peerReviewinGroups, maximumStudentsPerGroup });

}

const generateExcel = async ({ categories, answersKeys, studentQualifications, activityName, peerReviewinGroups, maximumStudentsPerGroup }) => {
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Uptitude';
    workbook.created = new Date();
    workbook.modified = new Date();

    const nameOrMail = peerReviewinGroups ? 'Evaluator' : 'Email';
    const nameOrMailEvaluated = studentQualifications.some((qual) => qual.activityGroup === true) || peerReviewinGroups ? 'Evaluated' : 'Email';

    // Agregar una hoja de cálculo por cada estudiante
    studentQualifications.forEach((user, index) => {
        const { name, email, qualificationsReceived, qualificationsGiven } = user;
        // Crear una hoja de cálculo para el estudiante actual
        const sheet = workbook.addWorksheet(`Peer Review ${name}`);
        const rowPeerReviewReceived = sheet.addRow([name + ' peer review received']);
        rowPeerReviewReceived.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5353EC' },
        };
        rowPeerReviewReceived.eachCell(cell => {
            cell.font = {
                color: { argb: 'FFFFFF' },
            };
        });
        const rowForEvaluator = ['Evaluator']

        if (nameOrMail === 'Evaluator') {
            for (let i = 0; i < maximumStudentsPerGroup; i++) { rowForEvaluator.push(`Evaluator`) }
            rowForEvaluator.pop()

        }
        else {
            rowForEvaluator.push(nameOrMail)
        }
        rowForEvaluator.push(...answersKeys.flatMap((key, index) => key))

        const headerRow = sheet.addRow(rowForEvaluator);
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5353EC' },
        };
        headerRow.eachCell(cell => {
            cell.font = {
                color: { argb: 'FFFFFF' },
            };
        });

        qualificationsReceived.forEach((qualification, index) => {
            const data = [qualification.name]
            if (qualification.email) {
                data.push(qualification.email)
            }
            else if (qualification.name2) {
                data.push(...qualification.name2)
                if (qualification.name2.length < maximumStudentsPerGroup) {
                    for (let i = 0; i < maximumStudentsPerGroup - qualification.name2.length; i++) {
                        data.push('')
                    }
                }
            }
            else {
                data.pop()
                data.push(...qualification.name)
                if (qualification.name.length < maximumStudentsPerGroup) {
                    for (let i = 0; i < maximumStudentsPerGroup - qualification.name.length; i++) {
                        data.push('')
                    }
                }
            }
            data.push(...categories.flatMap((key, index) => {
                const answer = qualification.answer[key] || {};
                const Key = (Object.keys(answer)[0]);
                return [Key || '', answer[Key] || ''];
            }))

            const row = sheet.addRow(data);
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

        const rowForEvaluated = [
            'Evaluated',
        ]
        if (nameOrMailEvaluated === 'Evaluated') {
            for (let i = 0; i < maximumStudentsPerGroup; i++) { rowForEvaluated.push(`Evaluated`) }
            if (peerReviewinGroups) {
                rowForEvaluated.pop()
            }
        }
        else {
            rowForEvaluated.push(nameOrMailEvaluated)
        }
        rowForEvaluated.push(...answersKeys.flatMap((key, index) => key))
        const headerRow2 = sheet.addRow(rowForEvaluated);
        headerRow2.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '5353EC' },
        };
        headerRow2.eachCell(cell => {
            cell.font = {
                color: { argb: 'FFFFFF' },
            };
        });
        qualificationsGiven.forEach((qualification, index) => {
            const data = [qualification.name]
            if (qualification.email) {
                data.push(qualification.email)
            }
            else if (qualification.name2) {
                data.push(...qualification.name2)
                if (qualification.name2.length < maximumStudentsPerGroup) {
                    for (let i = 0; i < maximumStudentsPerGroup - qualification.name2.length; i++) {
                        data.push('')
                    }
                }
            }
            else {
                data.pop()
                data.push(...qualification.name)
                if (qualification.name.length < maximumStudentsPerGroup) {
                    for (let i = 0; i < maximumStudentsPerGroup - qualification.name.length; i++) {
                        data.push('')
                    }
                }
            }
            data.push(...categories.flatMap((key, index) => {
                const answer = qualification.answer[key] || {};
                const Key = (Object.keys(answer)[0]);
                return [Key || '', answer[Key] || ''];
            }))
            const row = sheet.addRow(data);

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
    const link = document.createElement('a');
    link.href = url;
    link.download = `peer-review-${activityName}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const getStudentQualificationsPeerInGroups = (students, peerReviewAnswers, activityToReviewID) => {
    const idAdded = []
    const groups = students.flatMap((student) => {
        return student.attributes.groups?.data.filter((group) => {
            if (idAdded.includes(group.id)) return false
            idAdded.push(group.id)
            return group.attributes?.activity?.data?.id === activityToReviewID
        })
    }).filter(Boolean)

    const groupsQualifications = groups.map((group) => {
        const studentQualificationsGiven = peerReviewAnswers.filter((answer) =>
            answer.attributes.group?.data.id === group.id).map((answer) => {
                return {
                    name: answer.attributes.qualifications.data[0].attributes.group.data.attributes.users.data.map((user) => user.attributes.name),
                    answer: answer.attributes.Answers
                }
            });
        const studentQualificationsReceived = peerReviewAnswers.filter((answer) =>
            answer.attributes.qualifications?.data.some((qualification) =>
                qualification.attributes.group.data.id === group.id)).map((answer) => {
                    return {
                        name: answer.attributes.group.data.attributes.users.data.map((user) => user.attributes.name),
                        answer: answer.attributes.Answers
                    }
                })
        return {
            name: group.attributes.users.data.map((user) => user.attributes.name),
            qualificationsGiven: studentQualificationsGiven,
            qualificationsReceived: studentQualificationsReceived
        }
    })
    const maximumStudentsPerGroup = groupsQualifications.reduce((max, group) => {
        return group.name.length > max ? group.name.length : max
    }, 0)

    return { studentQualifications: groupsQualifications, maximumStudentsPerGroup, activityGroup: true }
}
const getStudentQualificationsNotPeerInGroups = (students, peerReviewAnswers, peerReviewinGroups, activityToReviewID) => {
    let maximumStudentsPerGroup = 0
    let activityGroup = false;
    const studentQualifications = students.map((student) => {
        const studentQualificationsGiven = peerReviewAnswers.filter((answer) =>
            answer.attributes.user?.data.id === student.id).map((answer) => {
                if (answer.attributes.qualifications.data.length > 1) {
                    activityGroup = true;
                    if (answer.attributes.qualifications.data.length > maximumStudentsPerGroup) {
                        maximumStudentsPerGroup = answer.attributes.qualifications.data.length
                    }
                    return {
                        name: answer.attributes.qualifications.data[0].attributes.user.data.attributes.name,
                        name2: answer.attributes.qualifications.data
                            .map((qual, index) => {
                                if (index !== 0) {
                                    return qual.attributes.user.data.attributes.name
                                }
                            }).filter(Boolean),
                        answer: answer.attributes.Answers
                    }
                }
                return {
                    name: answer.attributes.qualifications?.data[0].attributes.user.data.attributes.name,
                    email: answer.attributes.qualifications?.data[0].attributes.user.data.attributes.email,
                    answer: answer.attributes.Answers
                }
            });
        const studentQualificationsReceived = peerReviewAnswers.filter((answer) =>
            answer.attributes.qualifications?.data.some((qualification) =>
                qualification.attributes.user.data.id === student.id)).map((answer) => {
                    if (answer.attributes.qualifications.data.length > 1 && peerReviewinGroups) {
                        activityGroup = true;
                        const qual = answer.attributes.user.data.attributes.groups?.data
                            .filter((group) => group?.attributes?.activity?.data?.id === activityToReviewID)
                        const name2 = qual[0].attributes.users.data.find((user) => user.id !== student.id).attributes.name
                        return {
                            name: answer.attributes.user.data.attributes.name,
                            name2: name2,
                            answer: answer.attributes.Answers
                        }
                    }
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
            activityGroup: activityGroup
        }
    })

    return { studentQualifications, maximumStudentsPerGroup, activityGroup }
}