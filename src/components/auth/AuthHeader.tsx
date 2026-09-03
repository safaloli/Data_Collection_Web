import MaterialIcon from "../../assets/icons/MaterialIcon";

export default function AuthHeader() {
    return (<>
        <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-full font-manrope antialiased">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <MaterialIcon icon="storage" className="text-secondary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Data Point</span>
                </div>

            </div>
        </header>
    </>)
}