from game import Game

def get_user_menu_choice():
    """Display menu options and get a valid user menu selection."""
    print("\n" + "=" * 25)
    print("       GAME MENU       ")
    print("=" * 25)
    print("1. Play a new game")
    print("2. Show scores")
    print("3. Quit")
    
    while True:
        choice = input("Please select an option (1-3): ").strip()
        if choice in ["1", "2", "3"]:
            return choice
        print("Invalid option. Please enter 1, 2, or 3.")

def print_results(results):
    """Print score summary and thank the user."""
    print("\n" + "=" * 25)
    print("      GAME SUMMARY     ")
    print("=" * 25)
    print(f"Wins:   {results['win']}")
    print(f"Losses: {results['loss']}")
    print(f"Draws:  {results['draw']}")
    print("=" * 25)
    print("Thank you for playing!\n")

def main():
    # Score dictionary tracking stats
    results = {"win": 0, "loss": 0, "draw": 0}

    while True:
        user_choice = get_user_menu_choice()

        if user_choice == "1":
            # Instantiate new Game object for each round played
            game = Game()
            game_result = game.play()
            results[game_result] += 1
        elif user_choice == "2":
            # Show current scores without exiting
            print("\n--- CURRENT SCORES ---")
            print(f"Wins: {results['win']} | Losses: {results['loss']} | Draws: {results['draw']}")
        elif user_choice == "3":
            # Show overall summary and exit program
            print_results(results)
            break

if __name__ == "__main__":
    main()