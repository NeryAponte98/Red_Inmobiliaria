import { useState, useEffect  } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';


const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex layout-container">
      {/* Sidebar */}
      <Navbar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'with-sidebar' : 'sidebar-collapsed'}`}>
        {/* Top Header */}
        <header className="top-header">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className={`bi ${sidebarOpen ? 'bi-arrow-left' : 'bi-list'}`}></i>
          </button>
          <div className="user-info">
            <span className="user-name">Administrador</span>
            {/*img src="/api/placeholder/40/40" alt="User" className="user-avatar" />*/}
          </div>
        </header>
        
        {/* Page Content */}
        <main className="page-content">
          <Outlet /> {/* Reemplazamos children con Outlet */}
        </main>
        
        {/* Footer */}
        <footer className="content-footer">
          <p className="mb-0">Red Inmobiliaria &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;