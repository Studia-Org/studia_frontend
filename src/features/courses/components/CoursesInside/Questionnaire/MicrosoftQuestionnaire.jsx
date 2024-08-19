import React from 'react'


export const MicrosoftQuestionnaire = ({ embedCode }) => {

    return (
        <div dangerouslySetInnerHTML={{ __html: embedCode }} />
    )
}
