import {LuLayoutDashboard, LuUsers, LuLogOut, LuUpload, LuFile } from 'react-icons/lu'

export const SIDE_MENU_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/admin/dashboard"
    },
    {
        id: "02",
        label: "Users",
        icon: LuUsers,
        path: "/admin/get-users"
    },
    {
        id: "03",
        label: "Get Reports",
        icon:  LuFile,
        path: "/admin/reports"
    },
    {
        id: "04",
        label: "Logout",
        icon: LuLogOut,
        path: "logout"
    }
]