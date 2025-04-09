const bcrypt = require('bcrypt');

const pass = '5236987410';

bcrypt.hash(pass, 10).then((hash) => {
  console.log('Хэш:', hash);
});
