interface IMaterialIconProps {
    icon: string;
    className?: string;
}

export default function MaterialIcon({ icon, className }: Readonly<IMaterialIconProps>) {
    return (<>
        <span
            data-icon={icon}
            className={`material-symbols-outlined  ${className}`}
        >{icon}</span>
    </>)
}