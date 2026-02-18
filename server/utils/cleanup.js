const Token = require('../models/Token');
const Session = require('../models/Session');

// Cleanup expired tokens and sessions
const cleanupExpiredData = async () => {
  try {
    await Token.cleanupExpired();
    await Session.cleanupExpired();
    console.log('✓ Cleaned up expired tokens and sessions');
  } catch (error) {
    console.error('Cleanup error:', error);
  }
};

// Setup cleanup jobs
const setupCleanupJobs = () => {
  // Run cleanup every hour
  setInterval(cleanupExpiredData, 60 * 60 * 1000);
  
  // Run initial cleanup on startup
  cleanupExpiredData();
};

module.exports = { setupCleanupJobs, cleanupExpiredData };
