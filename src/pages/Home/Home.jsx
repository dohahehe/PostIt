// pages/Home/Home.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/SideBar/SideBar';
import RightSidebar from '../../components/RightSidebar/RightSidebar';

function Home() {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 py-8">
      <div className="flex gap-6 w-full">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-1/4 flex-shrink-0">
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 w-3/4 lg:w-2/4">
          <Outlet />
        </div>
        
        {/* Right Sidebar - Follow Suggestions */}
        <div className="hidden sm:block w-80 flex-shrink-0 w-1/4">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

export default Home;