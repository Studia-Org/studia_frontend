import React from 'react'
import ReactMarkdown from 'react-markdown'

export const Content = ({ selectedSubsection }) => {
    console.log(selectedSubsection)
    const markdownConverter = (text) => {
        return (
            <div className='prose max-w-none text-base'>
                <ReactMarkdown>{text}</ReactMarkdown>
            </div>
        )
    }
    return (
        <div>
            {markdownConverter(selectedSubsection.content)}
        </div>
    )
}
