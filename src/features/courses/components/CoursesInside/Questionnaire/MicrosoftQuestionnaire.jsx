import React from 'react'

export const MicrosoftQuestionnaire = ({ embedCode }) => {
    console.log(embedCode)
    return (
        <div dangerouslySetInnerHTML={{ __html: embedCode }} />
    )
}
