const bcrypt = require('bcryptjs');

const comparePasswords = (password, hash) => {
  const comparison = bcrypt.compare(password, hash);
  return comparison;
};

const h = '$2a$10$Px.ZS4NaaQHji3zGv4HQDOzQajwFT/MTYeY0Xy5rlf1BuG9ohSC7O';
const p = '1234';
const notp = '12345';

const x = bcrypt.compare(notp, h, function (err, res) {
  if (err) {
    // handle error
    console.error(err);
  }
  if (res) {
    console.log(res);
  }
  // Send JWT
  else if (!res) {
    // response is OutgoingMessage object that server response http request
    console.log(res);
  }
});

console.log(x);
