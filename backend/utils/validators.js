/**
 * Common validation utilities for Hela Fund Backend
 */

/**
 * Validate Sri Lankan NIC number
 * @param {string} nic - NIC number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateNIC = (nic) => {
  const nicPattern = /^([0-9]{9}[x|X|v|V]|[0-9]{12})$/;
  return nicPattern.test(nic);
};

/**
 * Validate Sri Lankan mobile number
 * @param {string} mobile - Mobile number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateMobile = (mobile) => {
  const mobilePattern = /^0[0-9]{9}$/;
  return mobilePattern.test(mobile);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailPattern.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long'
    };
  }
  
  return {
    isValid: true,
    message: 'Password is valid'
  };
};

/**
 * Validate student ID format
 * @param {string} studentId - Student ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateStudentId = (studentId) => {
  // Common format: XX/YYYY/NNNN (e.g., SC/2022/1234)
  const studentIdPattern = /^[A-Z]{2}\/\d{4}\/\d{4}$/;
  return studentIdPattern.test(studentId);
};

/**
 * Sanitize user input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > characters
    .substring(0, 500); // Limit length
};

/**
 * Check if user role is valid
 * @param {string} role - Role to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidRole = (role) => {
  const validRoles = ['requester', 'supporter'];
  return validRoles.includes(role);
};

/**
 * Check if requester can access a specific role
 * @param {string} userRole - User's actual role
 * @param {string} requestedRole - Role user wants to access
 * @returns {object} - { canAccess: boolean, message: string }
 */
export const checkRoleAccess = (userRole, requestedRole) => {
  // Requester can access both roles
  if (userRole === 'requester') {
    return {
      canAccess: true,
      message: 'Access granted'
    };
  }
  
  // Supporter can only access supporter role
  if (userRole === 'supporter' && requestedRole === 'supporter') {
    return {
      canAccess: true,
      message: 'Access granted'
    };
  }
  
  // Supporter trying to access requester role
  if (userRole === 'supporter' && requestedRole === 'requester') {
    return {
      canAccess: false,
      message: 'You are registered as a supporter and cannot access the requester portal. Please select the supporter role.'
    };
  }
  
  return {
    canAccess: false,
    message: 'Invalid role access'
  };
};

export default {
  validateNIC,
  validateMobile,
  validateEmail,
  validatePassword,
  validateStudentId,
  sanitizeInput,
  isValidRole,
  checkRoleAccess
};
