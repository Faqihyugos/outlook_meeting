import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import AuthenticationSsoLanding from "pages/authentication-sso-landing";
import EmployeeMeetingDashboard from "pages/employee-meeting-dashboard";
import AttendanceAnalyticsDashboard from "pages/attendance-analytics-dashboard";
import UserPermissionManagement from "pages/user-permission-management";
import MeetingManagementConsole from "pages/meeting-management-console";
import GuestMeetingSelection from "pages/guest-meeting-selection";
import SSOHandler from 'pages/SSOHandler';
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<AuthenticationSsoLanding />} />
        <Route path="/authentication-sso-landing" element={<AuthenticationSsoLanding />} />
        <Route path="/employee-meeting-dashboard" element={<EmployeeMeetingDashboard />} />
        <Route path="/attendance-analytics-dashboard" element={<AttendanceAnalyticsDashboard />} />
        <Route path="/user-permission-management" element={<UserPermissionManagement />} />
        <Route path="/meeting-management-console" element={<MeetingManagementConsole />} />
        <Route path="/guest-meeting-selection" element={<GuestMeetingSelection />} />
        <Route path="/sso-handler" element={<SSOHandler />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;