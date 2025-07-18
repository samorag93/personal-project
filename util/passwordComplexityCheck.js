const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

function passwordPass(password) {
  const { error } = passwordComplexity(complexityOptions).validate(password);
  if (error) {
    return { error: error.details[0].message };
  }
  return { error: null };
}

module.exports = {
  passwordPass,
};
