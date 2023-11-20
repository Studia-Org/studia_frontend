import { Dropdown } from 'flowbite-react';

export function DropDownMenu({ items, onClick, name, selected }) {
    return (
        <Dropdown label={name} dismissOnClick={true} style={{
            textAlign: "left",
            backgroundColor: selected ? "#1d46ff" : "rgb(118, 144, 255)",
            width: "100%",
        }} >
            {items.map((item, index) => (
                <Dropdown.Item
                    onClick={() => onClick(item)} key={index}>
                    {item.attributes.title}
                </Dropdown.Item>
            ))}
        </Dropdown>

    );
}
