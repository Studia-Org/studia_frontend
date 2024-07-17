import React, { useState, useEffect } from 'react'
import { Steps, Button, message, Popconfirm } from 'antd';
import { CSVConfiguration } from './UploadQualifications/CSVConfiguration';
import { Confirmation, uploadQualifications, uploadQualificationsPerGroup } from './UploadQualifications/Confirmation';
import { Visualization } from './UploadQualifications/Visualization';
import { extractDataFromSpreadsheet, parseData } from './UploadQualifications/helpers.js';
import { useAuthContext } from '../../../context/AuthContext';
import { useTranslation, Trans } from 'react-i18next';
export const UploadQualifications = ({ setUploadQualificationsFlag, activities, students }) => {
    const { t } = useTranslation();
    const [steps, setSteps] = useState(0)
    const { user } = useAuthContext();
    const [file, setFile] = useState([]);
    const [dataVisualization, setDataVisualization] = useState([])
    const [dataTable, setDataTable] = useState([])

    const [formValues, setFormValues] = useState({
        selectedActivity: null,
        studentInputColumn: '',
        qualificationInputColumn: '',
        commentsInputColumn: '',
        gradeAverageInputColumn: '',
        file: null,
    });
    const [filteredActivity, setFilteredActivity] = useState(activities.find(activity => activity.id === JSON.parse(formValues?.selectedActivity)?.id))

    function stepRenderer() {
        switch (steps) {
            case 0:
                return <CSVConfiguration students={students} activities={activities} formValues={formValues} setFormValues={setFormValues} file={file} setFile={setFile} />
            case 1:
                return <Visualization formValues={formValues} data={dataTable} isPeerReview={filteredActivity.attributes.BeingReviewedBy.data !== null} />
            case 2:
                return <Confirmation />
            default:
                break;
        }
    }

    useEffect(() => {
        if (formValues.selectedActivity) {
            setFilteredActivity(activities.find(activity => activity.id === JSON.parse(formValues.selectedActivity)?.id))
        }
        if (formValues.file) {
            extractDataFromSpreadsheet(formValues).then(dataList => {
                setDataVisualization(dataList);
            });
        }
    }, [formValues]);

    useEffect(() => {
        if (dataVisualization.length > 0) {
            setDataTable(parseData(JSON.parse(formValues.selectedActivity), dataVisualization, students, filteredActivity.attributes.BeingReviewedBy.data !== null));
        }
    }, [dataVisualization, formValues, students])

    const ButtonSteps = () => {
        return (
            <div className='flex gap-3 ml-auto'>
                <Button onClick={() => setSteps(steps - 1)}>
                    {t("CREATE_COURSES.NAVIGATION.back")}
                </Button>
                {
                    steps === 0 ? (
                        <Button onClick={() => handleContinue()}>
                            {t("CREATE_COURSES.NAVIGATION.continue")}
                        </Button>
                    ) : (
                        <Popconfirm
                            title={t("QUALIFICATIONS.are_you_sure_continue")}
                            onConfirm={() => {
                                handleContinue();
                                if (JSON.parse(formValues.selectedActivity).groupActivity) {
                                    uploadQualificationsPerGroup({
                                        dataTable,
                                        activity: formValues.selectedActivity,
                                        user,
                                        fullActivity: filteredActivity,
                                        t: t
                                    })
                                }
                                else {
                                    uploadQualifications({
                                        dataTable,
                                        activity: formValues.selectedActivity,
                                        user,
                                        fullActivity: filteredActivity,
                                        t: t

                                    })
                                }
                            }}
                            onCancel={() => { }}
                            okText={t("COMMON.yes")}
                            cancelText={t("COMMON.no")}
                        >
                            <Button>{t("CREATE_COURSES.NAVIGATION.confirm")}</Button>
                        </Popconfirm>
                    )
                }
            </div>
        );
    };


    const checkIfExcelRangeFormat = (value) => {
        const excelRangeRegex = /^([A-Z])\d+-\1\d+$/;
        return excelRangeRegex.test(value);
    };

    const checkIfFileIsCSV = (file) => {
        const filename = file.name
        const spreadsheetExtensions = ['.xls', '.xlsx', '.csv'];
        const fileExtension = filename.toLowerCase().slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        return spreadsheetExtensions.includes(`.${fileExtension}`);
    }

    const checkIfDataIsCorrect = () => {
        try {

            if (steps === 0) {
                const { selectedActivity, studentInputColumn, qualificationInputColumn, commentsInputColumn, file } = formValues;
                if (selectedActivity && studentInputColumn && qualificationInputColumn && commentsInputColumn && file) {
                    const isValidFile = checkIfFileIsCSV(file);
                    const isValidStudentInputColumn = checkIfExcelRangeFormat(studentInputColumn);
                    const isValidQualificationInputColumn = checkIfExcelRangeFormat(qualificationInputColumn);
                    const isValidCommentsInputColumn = checkIfExcelRangeFormat(commentsInputColumn);
                    if (isValidStudentInputColumn && isValidQualificationInputColumn && isValidCommentsInputColumn && isValidFile) {
                        return true;
                    }
                    else if (!isValidFile) {
                        message.error(t("QUALIFICATIONS.file_must_be_csv"));
                        return false;

                    } else {
                        message.error(t("QUALIFICATIONS.input_columns_must_be"));
                        return false;
                    }
                } else {
                    message.error(t("QUALIFICATIONS.input_columns_must_be_filled"));
                    return false;
                }
            } else if (steps === 1) {
                if (dataTable.length === 0) {
                    message.error(t("QUALIFICATIONS.no_data"));
                    return false;
                }
                else {
                    for (let i = 0; i < dataTable.length; i++) {
                        const student = dataTable[i];
                        if ((!student.Qualification || !student.Comments) && (!student.group.Qualification || !student.group.Comments)) {
                            message.error(
                                <Trans i18nKey="QUALIFICATIONS.student_missing"
                                    components={{
                                        name: student.Name.student.attributes.name
                                    }}
                                />
                            );
                            return false;
                        }
                    }
                    return true;
                }

            }
            else {
                return true;
            }
        } catch (error) {
            message.error(t("QUALIFICATIONS.peer_review_did_not_finish"));
            return false;
        }
    };

    const handleContinue = () => {
        if (filteredActivity &&
            filteredActivity.attributes.BeingReviewedBy.data !== null &&
            new Date(filteredActivity.attributes.BeingReviewedBy.data?.attributes?.deadline) > new Date()) {
            message.error('Peer review did not finish yet');
            return
        }
        if (checkIfDataIsCorrect()) {
            setSteps(steps + 1);
        }
    };


    return (
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-20">
            <div class=" items-center justify-between pb-4 bg-white  p-10">
                <button className='flex items-center text-sm duration-150 -translate-x-4 -translate-y-6 w-fit hover:-translate-x-6' onClick={() => setUploadQualificationsFlag(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1'>{t("CREATE_COURSES.COURSE_SECTIONS.CREATE_TASK.back_to_course")}</p>
                </button>
                <Steps
                    current={steps}
                    items={[
                        {
                            title: t("QUALIFICATIONS.csv_configuration"),
                            description: t("QUALIFICATIONS.csv_configuration_text"),
                        },
                        {
                            title: t("QUALIFICATIONS.visualization"),
                            description: t("QUALIFICATIONS.visualization_text"),
                        },
                        {
                            title: t("QUALIFICATIONS.confirmation"),
                            description: t("QUALIFICATIONS.confirmation_text"),
                        }
                    ]}
                />

                <h3 className='mt-10 text-lg font-medium'>{t("QUALIFICATIONS.upload_qualifications")}</h3>
                {filteredActivity &&
                    filteredActivity.attributes.BeingReviewedBy.data !== null &&
                    new Date(filteredActivity.attributes.BeingReviewedBy.data?.attributes?.deadline) > new Date() &&
                    <div className="px-4 py-2 mt-3 text-red-700 bg-red-100 border border-red-400 rounded w-fit" role="alert">
                        <strong className="text-sm font-bold">{t("QUALIFICATIONS.attention")}!</strong>
                        <span className="block text-sm sm:inline"> {t("QUALIFICATIONS.peerreview_deadline")} {new Date(filteredActivity.attributes.BeingReviewedBy.data.attributes.deadline).toLocaleDateString()}</span>
                    </div>
                }
                {stepRenderer()}

                {
                    steps !== 2 && (
                        <div className='flex w-full mt-10'>
                            <ButtonSteps />
                        </div>
                    )
                }


            </div>
        </div>
    )
}
