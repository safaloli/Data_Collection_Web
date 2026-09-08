export default function AuthHeader() {
    return (<>
        <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-full font-manrope antialiased">
                <div className="flex items-center gap-3">
                    <img
                        src="/favicon.svg"
                        alt="Jan Data logo"
                        className="h-9 w-9 rounded-full object-cover shadow-sm"
                    />
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Jan Data</span>
                </div>
            </div>
        </header>
    </>)
}