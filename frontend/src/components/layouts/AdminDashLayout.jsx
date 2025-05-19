import React, {useContext} from 'react'
import { UserContext } from '../../context/userContext'
import AdminNavbar from './AdminNavbar';
import SideMenu from './SideMenu';

const AdminDashLayout = ({children , activeMenu}) => {
    const {user}  = useContext(UserContext);
  return (
    <div>
        <AdminNavbar activeMenu={activeMenu} />
        {user && (
            <div className='flex'>
                <div className='max-[1080px]:hidden'>
                    <SideMenu activeMenu={activeMenu} />
                </div>
                <div className='grow '>{children}</div>
            </div>
        )}
    </div>
  )
}

export default AdminDashLayout
