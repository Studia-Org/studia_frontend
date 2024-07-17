import React from 'react'
import { useTranslation } from 'react-i18next';

export const Tag = ({ User, className }) => {
    const { t } = useTranslation();

    function renderTag() {
        if (User) {
            if (User && User.role_str === 'student') {
                return (
                    <span className={`bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded ${className}`}>{t("NAVBAR.student")}</span>
                )
            }
            else if (User && User.role_str === 'professor') {
                return (
                    <span className={`bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded ${className}`}>{t("NAVBAR.professor")}</span>
                )

            }
            else {
                return (
                    <span className={`bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded ${className}`}>{t("NAVBAR.admin")}</span>
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
