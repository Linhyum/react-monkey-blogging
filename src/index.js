import React from "react";
import "./styles/index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./utils/constants";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
const HomePage = lazy(() => import("./pages/HomePage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const SignInPage = lazy(() => import("./pages/SignInPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const PostDetailsPage = lazy(() => import("./pages/PostDetailsPage"));
const DashboardLayout = lazy(() => import("./module/dashboard/DashboardLayout"));
const PostManage = lazy(() => import("./module/post/PostManage"));
const PostUpdate = lazy(() => import("./module/post/PostUpdate"));
const PostAddNew = lazy(() => import("./module/post/PostAddNew"));
const UserUpdate = lazy(() => import("./module/user/UserUpdate"));
const UserAddNew = lazy(() => import("./module/user/UserAddNew"));
const UserProfile = lazy(() => import("./module/user/UserProfile"));
const UserManage = lazy(() => import("./module/user/UserManage"));
const CategoryAddNew = lazy(() => import("./module/category/CategoryAddNew"));
const CategoryManage = lazy(() => import("./module/category/CategoryManage"));
const CategoryUpdate = lazy(() => import("./module/category/CategoryUpdate"));
const HomeButton = lazy(() => import("./module/mode/HomeButton"));
const DarkMode = lazy(() => import("./module/mode/DarkMode"));
const container = document.getElementById("root");
const router = createBrowserRouter([
    {
        element: <DarkMode />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                element: <HomeButton />,
                children: [
                    {
                        path: "/sign-up",
                        element: <SignUpPage />,
                    },
                    {
                        path: "/sign-in",
                        element: <SignInPage />,
                    },
                    {
                        path: "*",
                        element: <NotFoundPage />,
                    },
                    {
                        path: "/:slug",
                        element: <PostDetailsPage />,
                    },
                    {
                        element: <DashboardLayout />,
                        children: [
                            {
                                path: "/manage/post",
                                element: <PostManage />,
                            },
                            {
                                path: "/manage/category",
                                element: <CategoryManage />,
                            },
                            {
                                path: "/manage/add-post",
                                element: <PostAddNew />,
                            },
                            {
                                path: "/manage/add-category",
                                element: <CategoryAddNew />,
                            },
                            {
                                path: "/manage/update-category",
                                element: <CategoryUpdate />,
                            },
                            {
                                path: "/manage/user",
                                element: <UserManage />,
                            },
                            {
                                path: "/manage/update-user",
                                element: <UserUpdate />,
                            },
                            {
                                path: "/manage/update-post",
                                element: <PostUpdate />,
                            },
                            {
                                path: "/manage/add-user",
                                element: <UserAddNew />,
                            },
                            {
                                path: "/profile",
                                element: <UserProfile />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
createRoot(container).render(
    <ThemeProvider theme={theme}>
        <GlobalStyles></GlobalStyles>
        <Suspense fallback={<></>}>
            <RouterProvider router={router}>
                <App />
            </RouterProvider>
        </Suspense>
        <ToastContainer />
    </ThemeProvider>
);

// root.render(
//     // <React.StrictMode>
//     <ThemeProvider theme={theme}>
//         <GlobalStyles></GlobalStyles>
//         <BrowserRouter>
// <App />
// <ToastContainer></ToastContainer>
//         </BrowserRouter>
//     </ThemeProvider>
//     // </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
