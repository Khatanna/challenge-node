const { Router } = require('express');
const {
  getAllCharacters,
  getCharacterDetail,
  createCharacter,
  updateAllCharacter,
  updateAttributeOfCharacter,
  deleteCharacter,
  getImageOfCharacter,
  getCharacterByName,
  getAllCharactersByAge,
  getAllCharactersByMovieId
} = require('../controllers/character');
const router = Router();

router.get('/form', (req, res) => {
  res.render('index');
});
router.get('/', getAllCharacters);
router.get('/', getCharacterByName);
router.get('/', getAllCharactersByAge);
router.get('/', getAllCharactersByMovieId);
router.get('/images/:id', getImageOfCharacter);
router.get('/detail/:id', getCharacterDetail);

router.post('/', createCharacter);
router.put('/:id', updateAllCharacter);
router.patch('/:id', updateAttributeOfCharacter);
router.delete('/:id', deleteCharacter);

module.exports = router;
