import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/userContext'
import { SIDE_MENU_DATA } from '../../utils/data';
import {useNavigate} from 'react-router-dom';

const SideMenu = ({activeMenu}) => {
  const {user, clearUser} = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);

  const navigate =  useNavigate();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return
    }
    navigate(route);
  }

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login")
  }

  useEffect(() => {
    if (user) {
      setSideMenuData(SIDE_MENU_DATA);
    }
  },[])

  return (
    <div className='w-64 h-[calc(100vh-61px)] bg-white border-r-2 border-gray-300/50 sticky top-[61px] z-20'>
      <div className='flex flex-col items-center justify-center mb-7 pt-5'>
        <div className='relative'>
          <img src={user?.profileImageUrl || ""} alt="Profile Image" className='w-30 h-30 bg-slate-400 rounded-full' />
        </div>
        {user.role === "admin" && (
          <div className='text-[10px] font-medium text-white bg-blue-500 px-3 py-0.5 rounded mt-1'>
            Admin
          </div>
        )}
        <h5 className='text-gray-950  text-xl font-medium leading-6 mt-3'>
          {user?.name || ""}
        </h5>
        <p className='text-sm text-gray-500'>{user?.email || ""}</p>
      </div>
      {sideMenuData.map((item, index) => (
        <button key={`menu_${index}`} className={`w-full flex items-center gap-4 text-[15px] font-medium ${activeMenu === item.label ? "text-blue-500 text-2xl bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3" : ""} py-3 px-6 mb-3 cursor-pointer`} onClick={() => handleClick(item.path)}>
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default SideMenu
