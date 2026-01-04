import Contact from '../models/Contact.js';

export async function getContacts(req, res) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean().exec();
    res.json({ success: true, count: contacts.length, contacts });
  } catch (err) {
    console.error('getContacts error:', err);
    res.status(500).json({ success: false, error: 'Unable to fetch contacts from database' });
  }
}

export async function submitContact(req, res) {
  try {
    const { name, email, phoneNumber, description } = req.body || {};

    if (!name || !email || !phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'name, email and phoneNumber are required'
      });
    }

    // prevent duplicate email
    const existing = await Contact.findOne({ email }).exec();
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Contact with this email already exists'
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      phoneNumber,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      contact: newContact
    });
  } catch (err) {
    console.error('submitContact error:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to save contact to database'
    });
  }
}
