import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { authRouter } from "./authRouter";
import { adminRouter } from "./adminRouter";

const router = createBrowserRouter([
    ...authRouter,
    ...adminRouter,
    { path: "*", element: <>Error page</> }
])

export default function RouterConfig() {
    return (<>
        <RouterProvider router={router} />
    </>)
}