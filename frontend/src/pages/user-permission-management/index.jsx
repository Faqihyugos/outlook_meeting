import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import UserCard from './components/UserCard';
import FilterPanel from './components/FilterPanel';
import BulkActionToolbar from './components/BulkActionToolbar';
import RoleManagementPanel from './components/RoleManagementPanel';
import IntegrationStatus from './components/IntegrationStatus';
import UserDetailPanel from './components/UserDetailPanel';

const UserPermissionManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const [savedFilters, setSavedFilters] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(20);

  // Mock user data
  const mockUsers = [
    {
      id: 1,
      name: "John Anderson",
      email: "john.anderson@company.com",
      employeeId: "EMP001",
      role: "admin",
      department: "engineering",
      status: "active",
      lastLogin: "2025-01-18 09:30",
      joinDate: "2023-03-15",
      manager: "Sarah Wilson",
      location: "New York, NY"
    },
    {
      id: 2,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      employeeId: "EMP002",
      role: "manager",
      department: "engineering",
      status: "active",
      lastLogin: "2025-01-18 08:45",
      joinDate: "2022-01-20",
      manager: "Michael Chen",
      location: "San Francisco, CA"
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      employeeId: "EMP003",
      role: "employee",
      department: "marketing",
      status: "active",
      lastLogin: "2025-01-17 16:20",
      joinDate: "2023-07-10",
      manager: "Lisa Rodriguez",
      location: "Austin, TX"
    },
    {
      id: 4,
      name: "Lisa Rodriguez",
      email: "lisa.rodriguez@company.com",
      employeeId: "EMP004",
      role: "manager",
      department: "marketing",
      status: "inactive",
      lastLogin: "2025-01-15 14:30",
      joinDate: "2021-11-05",
      manager: "David Kim",
      location: "Chicago, IL"
    },
    {
      id: 5,
      name: "David Kim",
      email: "david.kim@company.com",
      employeeId: "EMP005",
      role: "employee",
      department: "sales",
      status: "active",
      lastLogin: "2025-01-18 10:15",
      joinDate: "2023-09-12",
      manager: "Jennifer Brown",
      location: "Seattle, WA"
    },
    {
      id: 6,
      name: "Jennifer Brown",
      email: "jennifer.brown@company.com",
      employeeId: "EMP006",
      role: "admin",
      department: "hr",
      status: "active",
      lastLogin: "2025-01-18 07:50",
      joinDate: "2020-05-18",
      manager: "Robert Taylor",
      location: "Boston, MA"
    },
    {
      id: 7,
      name: "Robert Taylor",
      email: "robert.taylor@company.com",
      employeeId: "EMP007",
      role: "employee",
      department: "finance",
      status: "pending",
      lastLogin: "Never",
      joinDate: "2025-01-15",
      manager: "Jennifer Brown",
      location: "Denver, CO"
    },
    {
      id: 8,
      name: "Emily Davis",
      email: "emily.davis@company.com",
      employeeId: "EMP008",
      role: "manager",
      department: "operations",
      status: "active",
      lastLogin: "2025-01-18 11:25",
      joinDate: "2022-08-30",
      manager: "John Anderson",
      location: "Miami, FL"
    },
    {
      id: 9,
      name: "James Wilson",
      email: "james.wilson@company.com",
      employeeId: "EMP009",
      role: "employee",
      department: "engineering",
      status: "active",
      lastLogin: "2025-01-17 15:40",
      joinDate: "2023-12-01",
      manager: "Sarah Wilson",
      location: "Portland, OR"
    },
    {
      id: 10,
      name: "Maria Garcia",
      email: "maria.garcia@company.com",
      employeeId: "EMP010",
      role: "guest",
      department: "external",
      status: "active",
      lastLogin: "2025-01-18 13:10",
      joinDate: "2025-01-10",
      manager: "N/A",
      location: "Remote"
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.employeeId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply department filter
    if (filters.department) {
      filtered = filtered.filter(user => user.department === filters.department);
    }

    // Apply role filter
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Apply last login filter
    if (filters.lastLogin) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.lastLogin) {
        case '1day':
          filterDate.setDate(now.getDate() - 1);
          break;
        case '7days':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          filterDate.setDate(now.getDate() - 90);
          break;
        default:
          break;
      }
      
      if (filters.lastLogin !== '') {
        filtered = filtered.filter(user => {
          if (user.lastLogin === 'Never') return false;
          const userLastLogin = new Date(user.lastLogin);
          return userLastLogin >= filterDate;
        });
      }
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [filters, users]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSaveFilter = (name, filterData) => {
    setSavedFilters(prev => [...prev, { name, filters: filterData }]);
  };

  const handleBulkSelect = (userId, isSelected) => {
    setSelectedUsers(prev => 
      isSelected 
        ? [...prev, userId]
        : prev.filter(id => id !== userId)
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    // Implement bulk action logic here
    setSelectedUsers([]);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleToggleUserStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setShowUserDetail(false);
    setSelectedUser(null);
  };

  const handleCreateRole = (roleData) => {
    console.log('Creating role:', roleData);
    // Implement role creation logic
  };

  const handleUpdateRole = (roleData) => {
    console.log('Updating role:', roleData);
    // Implement role update logic
  };

  const handleResolveConflict = (conflictId) => {
    console.log('Resolving conflict:', conflictId);
    // Implement conflict resolution logic
  };

  const handleSyncNow = () => {
    console.log('Initiating sync...');
    // Implement sync logic
  };

  const handleImport = () => {
    console.log('Importing users...');
    // Implement import logic
  };

  const handleExport = () => {
    console.log('Exporting users...');
    // Implement export logic
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      
      <main className="lg:ml-64 pt-16">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-semibold text-foreground">
                User & Permission Management
              </h1>
              <p className="text-muted-foreground">
                Manage user accounts, roles, and access permissions
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredUsers.length} of {users.length} users
            </div>
          </div>

          {/* Integration Status */}
          <IntegrationStatus
            onResolveConflict={handleResolveConflict}
            onSyncNow={handleSyncNow}
          />

          {/* Filter Panel */}
          <FilterPanel
            onFilterChange={handleFilterChange}
            onSaveFilter={handleSaveFilter}
            savedFilters={savedFilters}
          />

          {/* Bulk Action Toolbar */}
          <BulkActionToolbar
            selectedCount={selectedUsers.length}
            onBulkAction={handleBulkAction}
            onImport={handleImport}
            onExport={handleExport}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* User List */}
            <div className="xl:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-medium text-foreground mb-4">
                  Users ({currentUsers.length})
                </h3>
                
                <div className="space-y-3">
                  {currentUsers.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      onEdit={handleEditUser}
                      onToggleStatus={handleToggleUserStatus}
                      onBulkSelect={handleBulkSelect}
                      isSelected={selectedUsers.includes(user.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div className="text-sm text-muted-foreground">
                      Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm">
                        {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Role Management Panel */}
            <div className="xl:col-span-1">
              <RoleManagementPanel
                onCreateRole={handleCreateRole}
                onUpdateRole={handleUpdateRole}
              />
            </div>
          </div>
        </div>
      </main>

      {/* User Detail Modal */}
      {showUserDetail && selectedUser && (
        <UserDetailPanel
          user={selectedUser}
          onClose={() => {
            setShowUserDetail(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UserPermissionManagement;