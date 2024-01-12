import React from 'react'

export const StudentRow = ({ student }) => {
    return (
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <th scope="row" class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                <img alt='' class="w-10 h-10 rounded-full" src={student.attributes.profile_photo.data.attributes.url} />
                <div class="pl-3">
                    <div class="text-base font-semibold">{student.attributes.name}</div>
                    <div class="font-normal text-gray-500">{student.attributes.email}</div>
                </div>
            </th>
            <td class="px-6 py-4">
                Silver
            </td>
            <td class="px-6 py-4">
                Laptop
            </td>
            <td class="px-6 py-4">
                $2999
            </td>
        </tr>
    )
}
