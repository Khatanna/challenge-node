const { Router } = require('express');
const {
  getAllCharacters,
  getCharacterDetail,
  createCharacter,
  updateAllCharacter,
  updateAttributeOfCharacter,
  deleteCharacter
} = require('../controllers/character');
const router = Router();

router.get('/', getAllCharacters);
router.get('/detail/:id', getCharacterDetail);
router.post('/', createCharacter);
router.put('/:id', updateAllCharacter);
router.patch('/:id', updateAttributeOfCharacter);
router.delete('/:id', deleteCharacter);

module.exports = router;
