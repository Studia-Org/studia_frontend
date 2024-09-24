import React from 'react'
import { Badge } from 'antd'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { ca, es, enUS } from 'date-fns/locale';

export const Header = ({ questionnaire }) => {
    const { i18n } = useTranslation();
    const locales = { ca, es }
    const local = locales[i18n.language] || enUS;
    return (
        <header className="bg-white rounded-md shadow-md border-t-[14px] border-[#6366f1] mb-5">
            <div className="flex flex-col w-full p-7">
                <div className='flex items-center w-full '>
                    <div className='flex items-center w-full gap-3'>
                        <p className="text-3xl font-semibold text-black">{questionnaire.attributes.Title}</p>
                        <Badge color="#6366f1" className='ml-auto mr-10' count={format(new Date(), "EEE MMM dd yyyy", { locale: local })} />
                    </div>
                </div>
                <div className='flex justify-between mt-7'>
                    <p>{questionnaire.attributes.description}</p>
                </div>
            </div>
        </header>
    )
}
