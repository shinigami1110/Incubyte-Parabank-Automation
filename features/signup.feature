Feature: User Registration

Scenario: Register a new user successfully
  Given user navigates to Parabank website
  When user registers with valid details
  Then account should be created successfully
