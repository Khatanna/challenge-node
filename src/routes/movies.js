const { Router } = require('express');
// const {
//   getAllCharacters,
//   getCharacterById,
//   createCharacter,
//   updateAllCharacter,
//   updateAttributeOfCharacter,
//   deleteCharacter
// } = require('../controllers/character');
const router = Router();

router.get('/', (req, res, next) => {
  res.send('uwu');
});
// router.get('/:id', getCharacterById);
// router.post('/', createCharacter);
// router.put('/:id', updateAllCharacter);
// router.patch('/:id', updateAttributeOfCharacter);
// router.delete('/:id', deleteCharacter);

module.exports = router;
