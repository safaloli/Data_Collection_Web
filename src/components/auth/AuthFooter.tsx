export default function AuthFooter() {
    return (<>
        <footer className="w-full py-8 border-t border-slate-100 dark:border-slate-900 bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-4 font-manrope text-sm">
                <p className="text-slate-500 dark:text-slate-500">
                    © 2024 EduPremium Systems. All rights reserved.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                    <a className="text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">Terms of Service</a>
                    <a className="text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
                    <a className="text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">Security</a>
                    <a className="text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer opacity-80 hover:opacity-100" href="#">Contact Support</a>
                </div>
            </div>
        </footer>
    </>)
}