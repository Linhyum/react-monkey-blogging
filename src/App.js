import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import { lazy, Suspense } from "react";
// import DarkMode from "./module/mode/DarkMode";
// import HomeButton from "./module/mode/HomeButton";
// import PostManage from "./module/post/PostManage";
// import CategoryManage from "./module/category/CategoryManage";
// import PostAddNew from "./module/post/PostAddNew";
// import CategoryAddNew from "./module/category/CategoryAddNew";
// import CategoryUpdate from "./module/category/CategoryUpdate";
// import UserManage from "./module/user/UserManage";
// import UserUpdate from "./module/user/UserUpdate";
// import PostUpdate from "./module/post/PostUpdate";
// import UserAddNew from "./module/user/UserAddNew";
// import UserProfile from "./module/user/UserProfile";
// import HomePage from "./pages/HomePage";
// import SignUpPage from "./pages/SignUpPage";
// import SignInPage from "./pages/SignInPage";
// import NotFoundPage from "./pages/NotFoundPage";
// import PostDetailsPage from "./pages/PostDetailsPage";
// import DashboardLayout from "./module/dashboard/DashboardLayout";
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
function App() {
    return (
        <AuthProvider>
            <Suspense fallback={<></>}>
                <Routes>
                    <Route element={<DarkMode></DarkMode>}>
                        <Route path="/" element={<HomePage></HomePage>}></Route>
                        <Route element={<HomeButton></HomeButton>}>
                            <Route path="/sign-up" element={<SignUpPage></SignUpPage>}></Route>
                            <Route path="/sign-in" element={<SignInPage></SignInPage>}></Route>
                            <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
                            <Route
                                path="/:slug"
                                element={<PostDetailsPage></PostDetailsPage>}
                            ></Route>
                            <Route element={<DashboardLayout></DashboardLayout>}>
                                <Route
                                    path="/manage/post"
                                    element={<PostManage></PostManage>}
                                ></Route>
                                <Route
                                    path="/manage/category"
                                    element={<CategoryManage></CategoryManage>}
                                ></Route>
                                <Route
                                    path="/manage/add-post"
                                    element={<PostAddNew></PostAddNew>}
                                ></Route>
                                <Route
                                    path="/manage/add-category"
                                    element={<CategoryAddNew></CategoryAddNew>}
                                ></Route>
                                <Route
                                    path="/manage/update-category"
                                    element={<CategoryUpdate></CategoryUpdate>}
                                ></Route>
                                <Route
                                    path="/manage/user"
                                    element={<UserManage></UserManage>}
                                ></Route>
                                <Route
                                    path="/manage/update-user"
                                    element={<UserUpdate></UserUpdate>}
                                ></Route>
                                <Route
                                    path="/manage/update-post"
                                    element={<PostUpdate></PostUpdate>}
                                ></Route>
                                <Route
                                    path="/manage/add-user"
                                    element={<UserAddNew></UserAddNew>}
                                ></Route>
                                <Route
                                    path="/profile"
                                    element={<UserProfile></UserProfile>}
                                ></Route>
                            </Route>
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </AuthProvider>
    );
}

export default App;
