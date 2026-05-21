import { createBrowserRouter, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../components/UI/Loader/Loader";
import ProtectRouter from "../components/protect/ProtectRouter";
import GusetRoute from "../components/protect/GuestROute";

// Lazy Loaded Components
const Login = lazy(() => import("../pages/Login/Login"));
const Management = lazy(() => import("../pages/management/Management"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));
const MainLayout = lazy(() => import("../layout/MainLayout"));
const Courses = lazy(() => import("../pages/management/Courses/Courses"));
const Rooms = lazy(() => import("../pages/management/Rooms/Rooms"));
const Staff = lazy(() => import("../pages/management/Staff/Staff"));
const Teachers = lazy(() => import("../pages/Teachers/Teachers"));
const Students = lazy(() => import("../pages/Students/Students"));
const Groups = lazy(() => import("../pages/Groups/Groups"));
const GroupDetail = lazy(() => import("../pages/Groups/GroupDetail"));
const CreateHomework = lazy(() => import("../pages/Groups/CreateHomework"));
const Gifts = lazy(() => import("../pages/Gifts/Gifts"));
const Default = lazy(() => import("../pages/management/default/Default"));
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" replace />
    },
    {
        path: '/login',
        element: (
            <GusetRoute>
                <Suspense fallback={<Loader />}>
                    <Login />
                </Suspense>
            </GusetRoute>
        )
    },
    {
        element: (
            <ProtectRouter>
                <Suspense fallback={<Loader />}>
                    <MainLayout />
                </Suspense>
            </ProtectRouter>
        ),
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />,
            },

            {
                path: '/dashboard/teachers',
                element: <Teachers />
            },
            {
                path: '/dashboard/students',
                element: <Students />
            },
            {
                path: '/dashboard/groups',
                element: <Groups />
            },
            {
                path: '/dashboard/groups/:id',
                element: <GroupDetail />
            },
            {
                path: '/dashboard/groups/:id/homework/create',
                element: <CreateHomework />
            },

            {
                path: '/dashboard/gifts',
                element: <Gifts />
            },

            {
                path: '/management',
                element: <Management />,
                children: [
                    {
                        path: 'courses',
                        element: <Courses />
                    },
                    {
                        path: 'rooms',
                        element: <Rooms />
                    },
                    {
                        path: 'staff',
                        element: <Staff />
                    },
                    {
                        index: true,
                        element: <Default />
                    },
                ]
            },
        ]
    },
    {
        path: '*',
        element: (
            <Suspense fallback={<Loader />}>
                <NotFound />
            </Suspense>
        )
    }
]);