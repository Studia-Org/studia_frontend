import React from 'react'

export const Tag = ({ User, className }) => {
    function renderTag() {
        if (User) {
            if (User && User.role_str === 'student') {
                return (
                    <span className={`bg-indigo-100 text-indigo-800 text-xs font-medium  px-2.5 py-0.5 rounded ${className}`}>Student</span>
                )
            }
            else if (User && User.role_str === 'professor') {
                return (
                    <span className={`bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded ${className}`}>Professor</span>
                )

            }
            else {
                return (
                    <span className={`bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded ${className}`}>Admin</span>
                )
            }
        }
    }
    return (
        <>
            {renderTag()}
        </>
    )
}
