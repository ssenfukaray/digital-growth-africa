const mongoose = require('mongoose');

const auditLeadSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    service: { type: String, trim: true, default: '' },
    budget: { type: String, trim: true, default: '' },
    source: { type: String, trim: true, default: 'ai-automation-demo' },
    message: { type: String, trim: true, required: true },
    transcript: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
      },
    ],
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLead', auditLeadSchema);
