import { Router } from 'express';

const router = Router();

// GET ALL TESTS
router.get('tests/api', (_, res) => {
  try {
    res.json();
  } catch (error) {}
});

router;

export default router;
