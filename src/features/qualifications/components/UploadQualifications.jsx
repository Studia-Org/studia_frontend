import React, { useState } from 'react'
import { Steps, Button } from 'antd';
import { CSVConfiguration } from './UploadQualifications/CSVConfiguration';
import { Visualization } from './UploadQualifications/Visualization';


export const UploadQualifications = ({ setUploadQualificationsFlag, activities }) => {
    const [steps, setSteps] = useState(0)

    const StepContent = () => {
        switch (steps) {
            case 0:
                return <CSVConfiguration activities={activities} />
            case 1:
                return <Visualization />
            default:
                break;
        }
    }

    const ButtonSteps = () => {
        return (
            <div className='gap-3 flex ml-auto'>
                <Button onClick={() => setSteps(steps - 1)}>
                    Back
                </Button>
                <Button onClick={() => setSteps(steps + 1)}>
                    Continue
                </Button>
            </div>
        )
    }

    return (
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-20">
            <div class=" items-center justify-between pb-4 bg-white  p-10">
                <button className='text-sm flex items-center w-fit hover:-translate-x-6 duration-150 -translate-x-4 -translate-y-6' onClick={() => setUploadQualificationsFlag(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
                    </svg>
                    <p className='ml-1'>Go back to course</p>
                </button>
                <Steps
                    current={steps}
                    items={[
                        {
                            title: 'CSV Configuration',
                            description: 'Configure the CSV file and select the activity desired.',
                        },
                        {
                            title: 'Visualization',
                            description: 'Visualize the data to upload before confirming.',
                        },
                        {
                            title: 'Confirmation',
                            description: 'Create the new qualification entries.',
                        }
                    ]}
                />
                <h3 className='mt-10 font-medium text-lg'>Upload Qualifications</h3>
                <StepContent />
                <div className='mt-10 flex w-full'>
                    <ButtonSteps />
                </div>
            </div>
        </div>
    )
}
