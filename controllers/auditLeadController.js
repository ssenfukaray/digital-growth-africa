const AuditLead = require('../models/AuditLead');

const getAuditLeads = async (req, res) => {
  try {
    const leads = await AuditLead.find().sort({ createdAt: -1 });
    return res.status(200).json({ count: leads.length, leads });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to retrieve audit leads' });
  }
};

const updateAuditLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'contacted', 'closed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Status must be new, contacted, or closed.' });
    }

    const lead = await AuditLead.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Audit lead not found' });
    }

    return res.status(200).json({ message: 'Audit lead status updated', lead });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to update audit lead status' });
  }
};

module.exports = { getAuditLeads, updateAuditLeadStatus };
