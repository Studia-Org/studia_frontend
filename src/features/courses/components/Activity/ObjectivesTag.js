import { ACTIVITY_CATEGORIES } from '../../../../constant';
import { Popover, Whisper } from 'rsuite';
import { useTranslation } from 'react-i18next';
export function ObjectivesTag({ category, USER_OBJECTIVES }) {
    const { t } = useTranslation();
    return (
        <div className='relative'>
            <Whisper
                placement="autoHorizontalEnd"
                trigger={USER_OBJECTIVES.includes(category) ? "hover" : "none"} controlId="control-id-hover"
                speaker={
                    <Popover>
                        <p>{t("OBJECTIVES_CONSTANT.linked_objectives")}</p>
                    </Popover>}>
                <span className={`relative z-10 text-sm font-medium bg-${ACTIVITY_CATEGORIES[category].color}-100 py-1 px-2  ${USER_OBJECTIVES.includes(category) ? "cursor-pointer" : ""}
                    rounded text-${ACTIVITY_CATEGORIES[category].color}-500 align-middle border-[1px] border-${ACTIVITY_CATEGORIES[category].color}-500`}>
                    {t("OBJECTIVES_CONSTANT." + category)}
                </span>
            </Whisper>
            <div className={`absolute ${USER_OBJECTIVES.includes(category) ? "blur" : ""} inset-0 -top-[1px] bg-${ACTIVITY_CATEGORIES[category].color}-500 rounded w-full h-[calc(100%+4px)]`} ></div>
        </div>
    )
}

export default function ObjectivesTags({ categories, category, USER_OBJECTIVES }) {
    return (
        <section className="flex flex-wrap gap-x-2 gap-y-6">
            {
                categories?.map((category) => {
                    return (
                        <ObjectivesTag key={category} category={category} USER_OBJECTIVES={USER_OBJECTIVES} />
                    )
                })
            }
        </section>
    )
}