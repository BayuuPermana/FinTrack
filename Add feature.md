1. Goal:
To enhance FinTrack by enabling users to manage finances across multiple distinct accounts. This will provide a more granular and accurate representation of their financial health.

2. Functional Requirements:

    Account Management (CRUD):

        Create: Users must be able to add new accounts, defining an "Account Name" (e.g., "BCA Savings," "GoPay Wallet") and an "Initial Balance."

        Read: A new section should display a list of all user-created accounts and their current balances.

        Update/Delete: Users should have the ability to edit an account's name or delete an account.

    Transaction Assignment:

        The "Add/Edit Transaction" form must include a mandatory field (e.g., a dropdown menu) to select the account associated with that transaction.

        The application logic must ensure that each transaction only affects the balance of the single account it is assigned to.

    Reporting and Dashboard Impact:

        The main dashboard should be updated to show an aggregated total balance across all accounts.

        The dashboard and reports sections should allow users to filter transactions and view financial summaries by a specific account.