const express = require("express");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const { getUsers } = require("../controllers/adminController");
const {changeRole}= require ("../controllers/changeRole")
const{updateStatus}= require ("../controllers/statusController")
const { getAuditLeads, updateAuditLeadStatus } = require("../controllers/auditLeadController")

const router = express.Router();

router.get(
  "/users",
  protect,
  adminOnly,
  getUsers
);
router.patch(
  "/users/:id/role",
  protect,
  adminOnly,
  changeRole
);
router.patch(
  "/users/:id/status",
  protect,
  adminOnly,
  updateStatus
);

router.get(
  "/audit-leads",
  protect,
  adminOnly,
  getAuditLeads
);

router.patch(
  "/audit-leads/:id/status",
  protect,
  adminOnly,
  updateAuditLeadStatus
);

module.exports = router;
