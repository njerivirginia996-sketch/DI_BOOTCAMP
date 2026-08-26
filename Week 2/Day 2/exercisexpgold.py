# ==========================================
# PART I, II & III: BANK ACCOUNT
# ==========================================

class BankAccount:
    def __init__(self, balance, username, password):
        self.balance = balance
        self.username = username
        self.password = password
        self.authenticated = False

    def authenticate(self, username, password):
        if username == self.username and password == self.password:
            self.authenticated = True
            return True
        return False

    def deposit(self, amount):
        if not self.authenticated:
            raise Exception("You must be authenticated to deposit money.")

        if not isinstance(amount, int) or amount <= 0:
            raise Exception("Deposit amount must be a positive integer.")

        self.balance += amount

    def withdraw(self, amount):
        if not self.authenticated:
            raise Exception("You must be authenticated to withdraw money.")

        if not isinstance(amount, int) or amount <= 0:
            raise Exception("Withdrawal amount must be a positive integer.")

        if amount > self.balance:
            raise Exception("Insufficient balance.")

        self.balance -= amount


# ==========================================
# PART II: MINIMUM BALANCE ACCOUNT
# ==========================================

class MinimumBalanceAccount(BankAccount):

    def __init__(self, balance, username, password, minimum_balance=0):
        super().__init__(balance, username, password)
        self.minimum_balance = minimum_balance

    def withdraw(self, amount):
        if not self.authenticated:
            raise Exception("You must be authenticated to withdraw money.")

        if not isinstance(amount, int) or amount <= 0:
            raise Exception("Withdrawal amount must be a positive integer.")

        if self.balance - amount < self.minimum_balance:
            raise Exception("Withdrawal would bring the balance below the minimum balance.")

        self.balance -= amount


# ==========================================
# PART IV: ATM
# ==========================================

class ATM:

    def __init__(self, account_list, try_limit):

        # Check account_list
        if not isinstance(account_list, list):
            raise Exception("account_list must be a list.")

        for account in account_list:
            if not isinstance(account, (BankAccount, MinimumBalanceAccount)):
                raise Exception("All items must be BankAccount or MinimumBalanceAccount.")

        self.account_list = account_list

        # Check try_limit
        try:
            if try_limit <= 0:
                raise Exception("try_limit must be a positive number.")
            self.try_limit = try_limit

        except:
            print("Invalid try limit. Setting try_limit to 2.")
            self.try_limit = 2

        self.current_tries = 0

        # Start ATM
        self.show_main_menu()

    # --------------------------------------
    # MAIN MENU
    # --------------------------------------

    def show_main_menu(self):

        while True:
            print("\n===== ATM MAIN MENU =====")
            print("1. Log in")
            print("2. Exit")

            choice = input("Choose an option: ")

            if choice == "1":
                username = input("Enter username: ")
                password = input("Enter password: ")

                self.log_in(username, password)

                # Stop if maximum attempts reached
                if self.current_tries >= self.try_limit:
                    print("You have reached the maximum number of tries.")
                    print("ATM shutting down.")
                    break

            elif choice == "2":
                print("Thank you for using the ATM.")
                break

            else:
                print("Invalid choice. Please try again.")

    # --------------------------------------
    # LOG IN
    # --------------------------------------

    def log_in(self, username, password):

        for account in self.account_list:

            if account.authenticate(username, password):
                print("\nLogin successful!")
                self.current_tries = 0
                self.show_account_menu(account)
                return

        # No account matched
        self.current_tries += 1

        print("Incorrect username or password.")
        print(f"Attempts: {self.current_tries}/{self.try_limit}")

        if self.current_tries >= self.try_limit:
            print("You have reached the maximum number of tries.")
            print("ATM shutting down.")

    # --------------------------------------
    # ACCOUNT MENU
    # --------------------------------------

    def show_account_menu(self, account):

        while True:

            print("\n===== ACCOUNT MENU =====")
            print(f"Balance: {account.balance}")
            print("1. Deposit")
            print("2. Withdraw")
            print("3. Exit")

            choice = input("Choose an option: ")

            if choice == "1":

                try:
                    amount = int(input("Enter amount to deposit: "))
                    account.deposit(amount)
                    print(f"Successfully deposited {amount}.")
                    print(f"New balance: {account.balance}")

                except Exception as error:
                    print(f"Error: {error}")

            elif choice == "2":

                try:
                    amount = int(input("Enter amount to withdraw: "))
                    account.withdraw(amount)
                    print(f"Successfully withdrew {amount}.")
                    print(f"New balance: {account.balance}")

                except Exception as error:
                    print(f"Error: {error}")

            elif choice == "3":
                print("Logging out...")
                account.authenticated = False
                break

            else:
                print("Invalid choice. Please try again.")


# ==========================================
# TESTING THE CLASSES
# ==========================================

account1 = BankAccount(
    1000,
    "virginia",
    "1234"
)

account2 = MinimumBalanceAccount(
    2000,
    "john",
    "5678",
    500
)

accounts = [account1, account2]

atm = ATM(accounts, 3)