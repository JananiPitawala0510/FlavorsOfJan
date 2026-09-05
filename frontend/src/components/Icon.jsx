const paths = {
    book: (
        <>
            <path d="M4 5.5C4 4.67 4.67 4 5.5 4H12v16H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
            <path d="M20 5.5c0-.83-.67-1.5-1.5-1.5H12v16h6.5c.83 0 1.5-.67 1.5-1.5v-13Z" />
            <path d="M12 4v16" opacity=".5" />
        </>
    ),
    carrot: (
        <>
            <path d="m4 20 8.5-8.5" />
            <path d="M12.5 11.5c2-3.5 5-6 8-6.5-.5 3-3 6-6.5 8l-3.5-1.5" />
            <path d="M15.5 4.5 17 3M18 6l1.5-1M17 7.5l1.5.5" />
        </>
    ),
    sparkles: (
        <>
            <path d="M11 3.5 12.3 7l3.5 1.3-3.5 1.3L11 13l-1.3-3.5L6.2 8.3l3.5-1.3L11 3.5Z" />
            <path d="M18 13.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
        </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    download: (
        <>
            <path d="M12 3.5v11" />
            <path d="m7.5 10.5 4.5 4.5 4.5-4.5" />
            <path d="M5 18.5h14" />
        </>
    ),
    pencil: (
        <path d="M4 20.5 4.6 17 15.8 5.8a1.9 1.9 0 0 1 2.7 0l.7.7a1.9 1.9 0 0 1 0 2.7L8 20.4l-4 .1Z" />
    ),
    trash: (
        <>
            <path d="M5 7h14" />
            <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
            <path d="M7 7l1 12.5A1.5 1.5 0 0 0 9.5 21h5a1.5 1.5 0 0 0 1.5-1.5L17 7" />
            <path d="M10 11v6M14 11v6" />
        </>
    ),
    chevronLeft: <path d="M15 5 8 12l7 7" />,
    chevronRight: <path d="M9 5l7 7-7 7" />,
    arrowRight: <path d="M4 12h16M14 6l6 6-6 6" />,
    search: (
        <>
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m20 20-4.35-4.35" />
        </>
    ),
    users: (
        <>
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3.5 20c0-3.3 2.7-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
            <path d="M16 5.2a3.2 3.2 0 0 1 0 6.2" />
            <path d="M15.5 14.6c2.5.3 4.9 2.4 4.9 5.4" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2" />
        </>
    ),
    check: <path d="m5 13 4.5 4.5L19.5 7" />,
    checkCircle: (
        <>
            <circle cx="12" cy="12" r="8.5" />
            <path d="m8.2 12.3 2.6 2.6 5-5.4" />
        </>
    ),
    alert: (
        <>
            <path d="M10.6 4.3a1.6 1.6 0 0 1 2.8 0l8 14.2a1.6 1.6 0 0 1-1.4 2.4H4a1.6 1.6 0 0 1-1.4-2.4l8-14.2Z" />
            <path d="M12 9.7v4M12 17.2h.01" />
        </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    flame: (
        <path d="M12 3s3.5 3.4 3.5 7a3.5 3.5 0 0 1-1 2.5c.9-.2 2-1.2 2-3 1.3 1.6 2 3.4 2 5A6.5 6.5 0 0 1 12 21a6.5 6.5 0 0 1-6.5-6.5c0-2.3 1-3.8 2-5 .1 1.4.9 2.2 1.6 2.6A5 5 0 0 1 8.5 10c0-3.6 3.5-7 3.5-7Z" />
    ),
    leaf: (
        <>
            <path d="M20 4C10 4 4 10 4 19c9 0 15-6 15-15Z" />
            <path d="M6 18C11 13 15 9 19 5" />
        </>
    ),
    scale: (
        <>
            <path d="M12 3v18M6 21h12" />
            <path d="M4 7h6M14 7h6" />
            <path d="M4 7l-2 5a3 3 0 0 0 6 0L6 7Z" />
            <path d="M18 7l-2 5a3 3 0 0 0 6 0l-2-5Z" />
        </>
    ),
    home: (
        <>
            <path d="M4 11.5 12 4l8 7.5" />
            <path d="M6 10v9.5A1.5 1.5 0 0 0 7.5 21h9a1.5 1.5 0 0 0 1.5-1.5V10" />
        </>
    ),
    bookmark: <path d="M7 3.5h10a1 1 0 0 1 1 1V21l-6-3.6L6 21V4.5a1 1 0 0 1 1-1Z" />,
    x: <path d="M6 6l12 12M18 6 6 18" />,
    loader: (
        <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
    ),
    dot: <circle cx="12" cy="12" r="4" />,
};

export default function Icon({ name, className = "h-5 w-5", strokeWidth = 1.8, ...rest }) {
    const content = paths[name];
    if (!content) return null;

    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
            {...rest}
        >
            {content}
        </svg>
    );
}
