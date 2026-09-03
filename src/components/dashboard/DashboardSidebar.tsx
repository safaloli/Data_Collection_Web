import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import MaterialIcon from "../../assets/icons/MaterialIcon";
import { SidebarDropdown } from "../ui/Dropdown";
import { NavLinkButton } from "../ui/Link";

export default function DashboardSidebar({
    collapsed,
    isMobile,
    temporarilyExpanded,
    onTemporaryExpand,
    onTemporaryCollapse,
    onClose
}: Readonly<{
    collapsed: boolean;
    isMobile: boolean;
    temporarilyExpanded: boolean;
    onTemporaryExpand: () => void;
    onTemporaryCollapse: () => void;
    onClose: () => void
}>) {
    const sidebarRef = useRef<HTMLElement>(null)
    const peekCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const expanded = !collapsed || temporarilyExpanded

    const expandTemporarily = () => {
        if (peekCloseTimeout.current) clearTimeout(peekCloseTimeout.current)
        onTemporaryExpand()
    }

    const closeTemporarily = () => {
        if (!collapsed) return
        if (peekCloseTimeout.current) clearTimeout(peekCloseTimeout.current)
        peekCloseTimeout.current = setTimeout(onTemporaryCollapse, 150)
    }

    useEffect(() => {
        if (!isMobile) return

        const handleOutsideClick = (event: MouseEvent) => {
            if (!sidebarRef.current) return

            const path = event.composedPath()

            // Ignore clicks coming from the sidebar toggle
            const clickedToggle = path.some(
                (element) =>
                    element instanceof HTMLElement &&
                    element.dataset.sidebarToggle === "true"
            )

            if (clickedToggle) {
                return
            }

            // Ignore clicks inside sidebar
            if (
                event.target instanceof Node &&
                sidebarRef.current.contains(event.target)
            ) {
                return
            }

            // Close sidebar when clicking outside
            if (!collapsed) {
                onClose()
            }
        }

        document.addEventListener("click", handleOutsideClick)

        return () => {
            document.removeEventListener("click", handleOutsideClick)
            if (peekCloseTimeout.current) clearTimeout(peekCloseTimeout.current)
        }
    }, [isMobile, collapsed, onClose])


    return (
        <aside
            ref={sidebarRef}
            onPointerEnter={expandTemporarily}
            onPointerLeave={closeTemporarily}
            onFocusCapture={expandTemporarily}
            onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeTemporarily()
            }}
            className={`flex flex-col gap-2 p-2 sm:p-4 fixed left-0 top-0 bottom-0 z-[50] bg-sidebar shadow-sm backdrop-blur-xl border-r border-border font-manrope text-sm transition-[width] duration-200 ${expanded ? "w-64" : "hidden sm:w-20 sm:block"}`}
        >

            <button type="button" onClick={onClose} className="absolute top-10 cursor-pointer right-3 sm:hidden" aria-label="Close sidebar" title="Close sidebar">
                <X className="size-5" />
            </button>
            <div className="px-4 py-6 flex items-center gap-3">
                <div className={expanded ? "" : "hidden"}>
                    <h2 className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400">Jan Data</h2>
                    <p className="text-xs! font-medium tracking-widest uppercase">Admin Portal</p>
                </div>
            </div>

            <nav className="flex-1 overflow-y-auto pb-4 space-y-1">
                <NavLinkButton
                    to="/"
                    title={expanded ? "Dashboard" : ""}
                    icon="dashboard"
                />

                <SidebarDropdown title={expanded ? "Citizens" : ""} icon={<MaterialIcon icon="people" />} collapsed={!expanded}>
                    <NavLinkButton to="citizens/list" title="Citizens List" />
                    <NavLinkButton to="citizens/add" title="Add Citizens" />
                    <NavLinkButton to="/citizens/import" title="Import Citizens" />
                </SidebarDropdown>

                <SidebarDropdown title={expanded ? "Reports" : ""} icon={<MaterialIcon icon="assessment" />} collapsed={!expanded}>
                    <NavLinkButton to="/reports/citizen-report" title="Citizen Report" />
                    <NavLinkButton to="/reports/data-summary" title="Data Summary" />
                </SidebarDropdown>

                <SidebarDropdown title={expanded ? "Users" : ""} icon={<MaterialIcon icon="group" />} collapsed={!expanded}>
                    <NavLinkButton to="/users" title="Users" />
                    <NavLinkButton to="/roles-permissions" title="Roles & Permissions" />
                </SidebarDropdown>
            </nav>

            <div className="mt-auto space-y-1">
                <NavLinkButton
                    to="/settings"
                    title={expanded ? "Settings" : ""}
                    icon="settings"
                />
            </div>
        </aside>
    )
}