import { Router } from "express";
import { identifyContact } from '../controllers/contact.controllers.js';

const router = Router();

router.post('/', identifyContact);

export default router;