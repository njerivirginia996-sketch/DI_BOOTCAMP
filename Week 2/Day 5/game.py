import random

class Game:
    VALID_ITEMS = ["rock", "paper", "scissors"]

    def get_user_item(self):
        """Prompt user to choose rock, paper, or scissors with input validation."""
        while True:
            user_input = input("Select an item (rock / paper / scissors): ").strip().lower()
            if user_input in self.VALID_ITEMS:
                return user_input
            print("Invalid choice! Please enter 'rock', 'paper', or 'scissors'.\n")

    def get_computer_item(self):
        """Randomly select and return rock, paper, or scissors."""
        return random.choice(self.VALID_ITEMS)

    def get_game_result(self, user_item, computer_item):
        """Determine and return the result of the round ('win', 'draw', or 'loss')."""
        if user_item == computer_item:
            return "draw"
        
        # Winning rules logic
        winning_combinations = {
            "rock": "scissors",      # Rock beats Scissors
            "paper": "rock",         # Paper beats Rock
            "scissors": "paper"      # Scissors beats Paper
        }
        
        if winning_combinations[user_item] == computer_item:
            return "win"
        else:
            return "loss"

    def play(self):
        """Execute a single round of the game and return the outcome string."""
        user_item = self.get_user_item()
        computer_item = self.get_computer_item()
        result = self.get_game_result(user_item, computer_item)

        # Output the round results
        print(f"\nYou selected {user_item.capitalize()}. The computer selected {computer_item.capitalize()}.")
        
        if result == "win":
            print("You won!")
        elif result == "loss":
            print("You lost!")
        else:
            print("You drew!")
            
        return result