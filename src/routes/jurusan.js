const router = require('express').Router();
const ctrl = require('../controllers/jurusanController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/',   authenticate, authorize('admin'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
