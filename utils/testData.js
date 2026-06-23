class TestDataStore {
  static instance;
  registeredUser;

  static getInstance() {
    if (!TestDataStore.instance) {
      TestDataStore.instance = new TestDataStore();
    }
    return TestDataStore.instance;
  }

  setRegisteredUser(user) {
    this.registeredUser = user;
  }

  getRegisteredUser() {
    if (!this.registeredUser) {
      throw new Error('No user has been registered yet in the test execution session.');
    }
    return this.registeredUser;
  }
}

const testDataStore = TestDataStore.getInstance();

module.exports = { testDataStore };
