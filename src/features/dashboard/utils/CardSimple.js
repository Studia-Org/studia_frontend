export function CardSimple({ title, id, styles, setActivity, onClick }) {
    return (
        <div onClick={onClick} className={`px-6 py-3 text-white rounded-lg box-border cardDash ${styles}`}>
            <p className="font-normal">{title}</p>
        </div>

    )
}