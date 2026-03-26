const router = require('express').Router();
const ctrl = require('../controllers/laporanController');
const { authenticate, authorize } = require('../middleware/auth');

// Rekap per matakuliah (letakkan sebelum /:id agar tidak tertimpa)
router.get('/rekap/matakuliah/:matakuliah_id', authenticate, ctrl.rekapMatakuliah);

router.get('/',     authenticate, ctrl.getAll);
router.get('/:id',  authenticate, ctrl.getById);
router.post('/',    authenticate, authorize('mahasiswa', 'admin'), ctrl.create);
router.put('/:id',  authenticate, authorize('mahasiswa', 'admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

module.exports = router;
