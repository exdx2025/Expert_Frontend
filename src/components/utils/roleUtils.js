// utils/roleUtils.js
export const hasPermission = (requiredRole, userRole) => {
  const roleHierarchy = {
    'super-admin': ['super-admin', 'admin', 'account', 'reception'],
    'admin': ['admin', 'account', 'reception'],
    'account': ['account'],
    'reception': ['reception']
  };
  
  return roleHierarchy[requiredRole]?.includes(userRole) || false;
};

export const getAvailableRoutes = (userRole) => {
  const allRoutes = {
    'super-admin': [
      'admin-dashboard', 'admin-offline-registration', 'view-offline-registrations',
      'admincart', 'upload-prescription', 'resume-submissions', 'category',
      'sub-category', 'expert-service-list', 'home-collection', 'book-appointment',
      'ambulance-services', 'request-callback', 'test-booking', 'admin-advertisement',
      'view-contact-us', 'admin-career', 'adminManagement', 'createAdmin', 'allAdmins'
    ],
    'admin': [
      'admin-dashboard', 'admin-offline-registration', 'view-offline-registrations',
      'admincart', 'upload-prescription', 'resume-submissions', 'category',
      'sub-category', 'expert-service-list', 'home-collection', 'book-appointment',
      'ambulance-services', 'request-callback', 'test-booking', 'admin-advertisement',
      'view-contact-us', 'admin-career'
    ],
    'account': [
      'admin-dashboard', 'admincart', 'resume-submissions', 'admin-advertisement'
    ],
    'reception': [
      'admin-dashboard', 'admin-offline-registration', 'view-offline-registrations',
      'home-collection', 'book-appointment', 'ambulance-services', 'request-callback',
      'test-booking', 'view-contact-us'
    ]
  };
  
  return allRoutes[userRole] || [];
};