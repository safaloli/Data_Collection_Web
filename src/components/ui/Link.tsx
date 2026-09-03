import { Link, NavLink } from "react-router-dom"
import MaterialIcon from "../../assets/icons/MaterialIcon"
import type { ReactNode } from "react";



export interface ILinkButton {
    to: string;
    className?: string;
    title: ReactNode;
    icon?: string;
}

export const LinkButton = ({ to, className, title, icon }: Readonly<ILinkButton>) => {
    return (<>
        <Link
            to={to}
            className={`inline-flex items-center justify-center gap-2
                rounded-xl

                bg-primary
                text-primary-foreground

                px-4 py-2

                transition-all duration-150
                active:scale-95

                hover:opacity-90
                ${className}`}
        >
            {icon && <MaterialIcon icon={icon} />}
            {title}
        </Link>
    </>)
}

export const NavLinkButton = ({ to, className, title, icon }: Readonly<ILinkButton>) => {
    return (<>
        <NavLink
            to={to}
            className={({ isActive }) => `
                w-full
                flex items-center
                rounded-xl
                px-4 py-2

                transition-all duration-150

                ${isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }

             ${className}`}
        >
            {icon && <MaterialIcon icon={icon} className="mr-3" />}
            {title}
        </NavLink>
    </>)
}