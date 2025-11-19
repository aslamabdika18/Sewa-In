/**
 * Check Role Middleware
 * 
 * Verify bahwa user memiliki role yang required
 * 
 * Usage:
 * router.post('/', auth, checkRole('ADMIN'), controller.create)
 * router.post('/', auth, checkRole(['ADMIN', 'MODERATOR']), controller.create)
 */

function checkRole(requiredRoles) {
  return (req, res, next) => {
    // Check bahwa user sudah authenticated (dari auth middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthenticated'
      });
    }

    // Normalize requiredRoles ke array
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    // Check apakah user.role ada di requiredRoles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke resource ini'
      });
    }

    next();
  };
}

module.exports = checkRole;
