
import express from "express";
import { getContacts, submitContact } from "../controllers/contactFormController.js";

const router = express.Router();

// GET all contacts
router.get("/getContacts", getContacts);

// POST submit contact
router.post("/submitContact", submitContact);

export default router;
