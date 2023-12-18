import { DropDownMenu } from "../../../../utils/DropDownMenu";
export function DropDownCourse({ courseInformation, selectedCourse, setSelectedCourse }) {
    return (
        <div className="flex-col w-[40%] max-w-sm">
            <DropDownMenu
                items={courseInformation}
                name={selectedCourse !== "Section" ? selectedCourse.attributes.title : selectedCourse}
                onClick={(section) => { setSelectedCourse(section); }}
                selected={selectedCourse !== "Section"} />
        </div>
    )
}

export function DropDownSection({ selectedCourse, selectedSection, setSelectedSection, setSelectedActivity }) {
    return (
        <div className="flex-col w-[49%] ">
            <p className="text-xl font-semibold">Section</p>
            <DropDownMenu
                items={selectedCourse.attributes.subsections.data}
                name={selectedSection !== "Subsection" ? selectedSection.attributes.title : selectedSection}
                onClick={(section) => { setSelectedSection(section); setSelectedActivity("Activity") }}
                selected={selectedSection !== "Subsection"} />
        </div >
    )
}