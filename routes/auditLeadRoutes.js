const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const AuditLead = require('../models/AuditLead');

const router = express.Router();
const leadFilePath = path.join(__dirname, '..', 'data', 'audit-leads.json');

function hasContactMethod(body) {
  return Boolean((body.email && body.email.trim()) || (body.phone && body.phone.trim()));
}

function saveLeadToFile(lead) {
  fs.mkdirSync(path.dirname(leadFilePath), { recursive: true });

  let existing = [];
  if (fs.existsSync(leadFilePath)) {
    existing = JSON.parse(fs.readFileSync(leadFilePath, 'utf8') || '[]');
  }

  const localLead = {
    _id: `local-${Date.now()}`,
    ...lead,
    status: 'new',
    createdAt: new Date().toISOString(),
    storage: 'local-file',
  };

  fs.writeFileSync(leadFilePath, JSON.stringify([localLead, ...existing], null, 2));
  return localLead;
}

router.post('/', async (req, res) => {
  try {
    const { name = '', email = '', phone = '', company = '', service = '', budget = '', source = 'ai-automation-demo', message = '', transcript = [] } = req.body;

    if (!message.trim()) {
      return res.status(400).json({ message: 'A short message is required.' });
    }

    if (!hasContactMethod(req.body)) {
      return res.status(400).json({ message: 'Please include an email address or phone number.' });
    }

    const leadPayload = {
      name,
      email,
      phone,
      company,
      service,
      budget,
      source,
      message,
      transcript,
          };

    if (mongoose.connection.readyState === 1) {
      const lead = await AuditLead.create(leadPayload);
      return res.status(201).json({
        message: 'Audit lead saved.',
        leadId: lead._id,
        storage: 'mongodb',
      });
    }

    const localLead = saveLeadToFile(leadPayload);
    return res.status(201).json({
      message: 'Audit lead saved locally because MongoDB is offline.',
      leadId: localLead._id,
      storage: 'local-file',
    });
  } catch (error) {
    console.error('Audit lead error:', error);
    return res.status(500).json({ message: 'Could not save audit lead.' });
  }
});

module.exports = router;

