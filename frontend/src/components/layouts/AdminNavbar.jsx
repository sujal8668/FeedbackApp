import React, { useState } from 'react';
import SideMenu from './SideMenu';
import { HiOutlineX, HiOutlineMenu } from 'react-icons/hi';

const AdminNavbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <>
      {/* Navbar: always visible on top */}
      <div className='flex gap-5  bg-white border-b-2 border-gray-300/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-50'>
        <button
          className='block xl:hidden text-black cursor-pointer'
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          {openSideMenu ? (
            <HiOutlineX className='text-2xl' />
          ) : (
            <HiOutlineMenu className='text-2xl' />
          )}
        </button>
        <h2 className='text-xl font-semibold text-black'>FeedBack</h2>
      </div>

      {/* Mobile Sidebar Overlay */}
      {openSideMenu && (
        <div className='fixed inset-0 z-40 flex'>
          {/* Blurred Background */}
          <div
            className='absolute inset-0 backdrop-blur-[2px]'
            onClick={() => setOpenSideMenu(false)}
          ></div>

          {/* Side Menu */}
          <div className='relative z-50 w-64 bg-white h-full shadow-md'>
            <SideMenu activeMenu={activeMenu} />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;
