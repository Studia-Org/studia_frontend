export function ForumDash({ coursetInformation, styles }) {
    return (
        <section
            className={`p-5 bg-white shadow-lg rounded-lg box-border ${styles}`}
        >
            <p className="text-2xl font-semibold">Forum contributions</p>
            <div className="flex flex-wrap gap-y-2 gap-x-2 "></div>
        </section>
    );
}