Feature: User Login

Scenario: Login using newly created account
  Given user has a registered account
  When user logs in
  Then account overview page should be displayed
  And account balance should be printed
