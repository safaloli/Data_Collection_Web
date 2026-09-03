import DashboardPage from "../pages/dashboard/DashboardPage";
// import UserLayout from "../pages/layout/UserLayout";

import CitizenFormPage from "../pages/citizens/CitizenFormPage";
import CitizenListPage from "../pages/citizens/CitizensListPage";
import CitizenDetailsPage from "../pages/citizens/CitizenDetailsPage";
import UserLayout from "../pages/layout/UserLayout";
import { UserRoles } from "../utils/constants";
import CitizenImportPage from "../pages/citizens/CitizenImportPage";
import UsersPage from "../pages/users/UsersPage";
import RolesPermissionsPage from "../pages/users/RolesPermissionsPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import SuperadminOnly from "../pages/users/SuperadminOnly";

export const adminRouter = [
    {
        path: "/",
        element: <UserLayout allowRole={[UserRoles.ADMIN, UserRoles.SUPERADMIN]} />,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: "citizens/list", element: <CitizenListPage /> },

            { path: "citizens/add", element: <CitizenFormPage /> },
            { path: "citizens/edit/:id", element: <CitizenFormPage /> },
            { path: "citizens/:id", element: <CitizenDetailsPage /> },

            { path: "citizens/import", element: <CitizenImportPage /> },
            { path: "users", element: <SuperadminOnly><UsersPage /></SuperadminOnly> },
            { path: "roles-permissions", element: <SuperadminOnly><RolesPermissionsPage /></SuperadminOnly> },
            { path: "change-password", element: <ChangePasswordPage /> },

            { path: "settings", element: <div> Settings</div> },

        ]
    }
]
