# Parabank Automation Framework

A production-grade, highly reliable test automation repository for ParaBank using Playwright, JavaScript, and Cucumber BDD.

## Project Overview
This repository automates user registration, login, and account overview balance extraction on the ParaBank demo application. It implements a robust Page Object Model (POM) and uses dynamic, self-healing connection configuration parameters to achieve 100% stability.

## Tech Stack
*   **Automation Driver**: Playwright (JS/Node)
*   **Test Runner**: Cucumber BDD
*   **Language**: JavaScript (ES6+ / CommonJS)
*   **Design Pattern**: Page Object Model (POM)
*   **Logging & Reports**: Winston logger & native Cucumber HTML reporter

## Folder Structure
```text
.
├── README.md
├── package.json
├── playwright.config.js
├── cucumber.js
├── .gitignore
├── features
│   ├── login.feature
│   └── signup.feature
├── step-definitions
│   ├── login.steps.js
│   └── signup.steps.js
├── pages
│   ├── AccountOverviewPage.js
│   ├── HomePage.js
│   ├── LoginPage.js
│   └── RegistrationPage.js
├── utils
│   ├── logger.js
│   ├── randomUserGenerator.js
│   └── testData.js
├── hooks
│   └── hooks.js
├── screenshots
├── videos
└── reports
```

## Execution

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Execute Scenarios**:
   * **macOS/Linux**:
     ```bash
     npx cucumber-js
     ```
   * **Windows (PowerShell)**:
     ```powershell
     npx.cmd cucumber-js
     ```

## Proof of Execution
*   **Console Logging**: The extracted account balance is printed to the console using a structured logger.
*   **Screenshot Proof**: Saved at `screenshots/login_success.png` upon successful login.
*   **Video Proof**: Saved at `videos/login_success.webm` upon successful login.
*   **HTML Report**: Generated at `reports/cucumber-report.html`.

## Framework Design Decisions
*   **Page Object Model (POM)**: Implemented to separate DOM locators and page-level actions from test step definitions, ensuring high modularity and low maintenance overhead.
*   **BDD (Gherkin)**: Used to define feature specifications in human-readable language, aligning developers, QA, and business stakeholders.
*   **Stable Locators**: Prioritized Playwright's role-based and text-based locators (`getByRole`, `getByText`) to align with accessibility standards and reduce test fragility compared to xpath or index-based CSS selectors.
*   **Dynamic Test Data**: Implemented unique timestamp-based usernames for each test run to ensure repeatable, self-contained executions with no state dependencies.

## Suggested Git Commit History
Commits should occur sequentially in the following phases:
1. `feat: initial framework structure and configuration setup`
2. `feat: add cucumber BDD feature files`
3. `feat: implement page object classes`
4. `feat: add reusable utilities and hooks`
5. `feat: implement registration flow`
6. `feat: implement login flow and balance capture`
7. `feat: add screenshot and video proof handling`
8. `docs: update README and perform final repository cleanup`

## Notes
The public ParaBank environment occasionally displays a 'This username already exists.' message immediately after registration. Since the account is already persisted, the framework performs a verification step by logging in with the newly created credentials. This ensures stable and repeatable execution without impacting the overall flow.

