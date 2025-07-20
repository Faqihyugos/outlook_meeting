import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState('employee'); // employee, manager, admin, guest
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Mock user role detection
  useEffect(() => {
    const roles = ['employee', 'manager', 'admin'];
    const mockRole = roles[Math.floor(Math.random() * roles.length)];
    setUserRole(mockRole);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const navigationItems = [
    {
      section: 'Dashboard',
      items: [
        {
          label: 'My Meetings',
          path: '/employee-meeting-dashboard',
          icon: 'Calendar',
          roles: ['employee', 'manager', 'admin'],
          description: 'View and manage your meeting attendance'
        },
        {
          label: 'Guest Check-in',
          path: '/guest-meeting-selection',
          icon: 'UserCheck',
          roles: ['guest', 'manager', 'admin'],
          description: 'Quick meeting check-in for guests'
        }
      ]
    },
    {
      section: 'Management',
      items: [
        {
          label: 'Meeting Console',
          path: '/meeting-management-console',
          icon: 'Settings',
          roles: ['manager', 'admin'],
          description: 'Manage meetings and attendance settings'
        },
        {
          label: 'User Management',
          path: '/user-permission-management',
          icon: 'Users',
          roles: ['admin'],
          description: 'Manage user permissions and access'
        }
      ]
    },
    {
      section: 'Analytics',
      items: [
        {
          label: 'Analytics Dashboard',
          path: '/attendance-analytics-dashboard',
          icon: 'BarChart3',
          roles: ['manager', 'admin'],
          description: 'View attendance reports and insights'
        }
      ]
    }
  ];

  const filteredNavigation = navigationItems.map(section => ({
    ...section,
    items: section.items.filter(item => item.roles.includes(userRole))
  })).filter(section => section.items.length > 0);

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setSearchQuery('');
    }
  };

  const Logo = () => (
    <div className="flex items-center space-x-3 px-6 py-4 border-b border-border">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Calendar" size={20} className="text-primary-foreground" />
      </div>
      {!isCollapsed && (
        <div>
          <h1 className="text-lg font-heading font-semibold text-foreground">
            Meeting Tracker
          </h1>
          <p className="text-xs text-muted-foreground">
            Outlook Integration
          </p>
        </div>
      )}
    </div>
  );

  const NavigationSearch = () => (
    <div className="px-6 py-3 border-b border-border">
      <div className="relative">
        <Icon 
          name="Search" 
          size={16} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
        />
        <input
          type="text"
          placeholder="Search navigation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>
    </div>
  );

  const NavigationItem = ({ item }) => {
    const isActive = isActiveRoute(item.path);
    
    return (
      <button
        onClick={() => handleNavigation(item.path)}
        className={`
          w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors duration-150
          ${isActive 
            ? 'bg-primary text-primary-foreground border-r-2 border-primary' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }
        `}
        title={isCollapsed ? item.label : item.description}
      >
        <Icon 
          name={item.icon} 
          size={20} 
          className={isActive ? 'text-primary-foreground' : 'text-current'} 
        />
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">
              {item.label}
            </div>
            {!isActive && (
              <div className="text-xs text-muted-foreground truncate">
                {item.description}
              </div>
            )}
          </div>
        )}
      </button>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <Logo />
      
      {(userRole === 'manager' || userRole === 'admin') && showSearch && (
        <NavigationSearch />
      )}
      
      <nav className="flex-1 overflow-y-auto py-4">
        {filteredNavigation.map((section, sectionIndex) => (
          <div key={section.section} className={sectionIndex > 0 ? 'mt-6' : ''}>
            {!isCollapsed && (
              <div className="px-6 py-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {section.section}
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {section.items
                .filter(item => 
                  !searchQuery || 
                  item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                  <NavigationItem key={item.path} item={item} />
                ))
              }
            </div>
          </div>
        ))}
      </nav>
      
      {/* Bottom Actions */}
      <div className="border-t border-border p-4 space-y-2">
        {(userRole === 'manager' || userRole === 'admin') && (
          <Button
            variant="ghost"
            size="sm"
            iconName="Search"
            onClick={toggleSearch}
            className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
          >
            {!isCollapsed && (showSearch ? 'Hide Search' : 'Search')}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`w-full justify-start ${isCollapsed ? 'px-2' : ''}`}
        >
          {!isCollapsed && 'Collapse'}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-100 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        iconName="Menu"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-110 lg:hidden"
      >
        Menu
      </Button>

      {/* Desktop Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full z-100 transition-all duration-300 ease-enterprise
          ${isCollapsed ? 'w-16' : 'w-64'}
          hidden lg:block
        `}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-64 z-110 transition-transform duration-300 ease-enterprise
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden
        `}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;