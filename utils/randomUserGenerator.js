function generateRandomUser() {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 10000);
  return {
    firstName: `TestFN_${randomNum}`,
    lastName: `TestLN_${randomNum}`,
    street: `${randomNum} Main Street`,
    city: 'Indianapolis',
    state: 'Indiana',
    zipCode: '46201',
    phoneNumber: `317-555-${String(randomNum).padStart(4, '0')}`,
    ssn: `999-${String(randomNum % 100).padStart(2, '0')}-${String(randomNum).padStart(4, '0')}`,
    username: `user_${timestamp}`,
    password: `P@ssword_${timestamp}`
  };
}

module.exports = { generateRandomUser };
