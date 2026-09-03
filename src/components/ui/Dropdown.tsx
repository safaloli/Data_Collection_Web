import { useEffect, useRef, useState, type ReactNode } from "react"
import MaterialIcon from "../../assets/icons/MaterialIcon";
import Portal from "./Portal";

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
}

interface DropdownItemProps {
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
    danger?: boolean;
    onClick?: () => void;
}

interface SidebarDropdownProps {
    icon?: ReactNode;
    title: string;
    children: ReactNode;
    collapsed?: boolean;
}

export const Dropdown = ({ trigger, children, className = "" }: Readonly<DropdownProps>) => {
    const [open, setOpen] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const triggerRef = useRef<HTMLDivElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const [position, setPosition] = useState({
        top: 0,
        left: 0
    })

    const toggleDropdown = () => {
        if (!open && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect()

            setPosition({
                top: rect.bottom + 8,
                left: rect.right
            })
        }

        setOpen(prev => !prev)
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node
            if (
                containerRef.current?.contains(target) ||
                dropdownRef.current?.contains(target)
            ) {
                return
            }

            setOpen(false)
        }

        document.addEventListener("click", handleClickOutside)
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [])

    return (<>
        <div className="relative" ref={containerRef}>
            {/* trigger  */}
            <div
                ref={triggerRef}
                onClick={toggleDropdown}
                className="cursor-pointer"
            >
                {trigger}
            </div>

            {/* dropdown  */}
            {open &&
                <Portal>
                    <div ref={dropdownRef}
                        className={`
                        fixed w-fit top-0 right-0
                        rounded-xl bg-card shadow-lg border border-border
                        overflow-hidden z-50 animate-in fade-in zoom-in-95 ${className}`}
                        style={{
                            top: position.top,
                            left: position.left,
                            transform: "translateX(-100%)"
                        }}
                    >
                        {children}
                    </div>
                </Portal>
            }
        </div>
    </>)
}

export const DropdownItem = ({
    icon,
    children,
    className,
    danger,
    onClick
}: Readonly<DropdownItemProps>) => {

    return (<>
        <button
            onClick={onClick}
            className={`
                flex items-center gap-3 
                w-full px-4 py-2 text-sm 
                ${danger ? "text-red-500 hover:bg-red-50"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"}
                transition ${className}`}
        >
            {icon}
            {children}
        </button>
    </>)
}

export const SidebarDropdown = ({ icon, title, children, collapsed = false }: Readonly<SidebarDropdownProps>) => {
    const [open, setOpen] = useState<boolean>(false)

    return (<>
        <div>
            {/* Parent */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className={`
                    flex items-center justify-between
                    w-full px-4 py-2 rounded-lg 
                    hover:text-foreground 
                    hover:bg-muted transition
                    ${open
                        ? "text-foreground"
                        : "text-muted-foreground"} 
                `}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{title}</span>
                </div>

                {!collapsed && <MaterialIcon
                    icon="expand_more"
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />}
            </button>

            {/* Children */}
            {open && !collapsed && (
                <div className="ml-9 ">
                    {children}
                </div>
            )}
        </div>
    </>)
}