def display_board(board):
    """Prints the 3x3 game board in a readable grid format."""
    print("\n   0   1   2")
    for row_idx, row in enumerate(board):
        print(f"{row_idx}  " + " | ".join(row))
        if row_idx < 2:
            print("  ---" * 3)
    print()


def player_input(player, board):
    """Gets and validates row/column input from the current player."""
    while True:
        try:
            move = input(
                f"Player '{player}', enter row and column (0-2) separated by space (e.g. '0 1'): "
            )
            row, col = map(int, move.strip().split())

            if row not in range(3) or col not in range(3):
                print("Invalid position! Row and column must be 0, 1, or 2.")
                continue

            if board[row][col] != " ":
                print("That spot is already taken! Choose another cell.")
                continue

            return row, col
        except ValueError:
            print("Invalid input! Please enter two numbers separated by a space.")


def check_win(board, player):
    """Checks rows, columns, and diagonals to see if the current player has won."""
    # Check rows and columns
    for i in range(3):
        if all(board[i][j] == player for j in range(3)):  # Row check
            return True
        if all(board[j][i] == player for j in range(3)):  # Column check
            return True

    # Check diagonals
    if all(board[i][i] == player for i in range(3)):  # Main diagonal
        return True
    if all(board[i][2 - i] == player for i in range(3)):  # Anti-diagonal
        return True

    return False


def check_tie(board):
    """Checks if all cells are filled without a winner."""
    return all(cell != " " for row in board for cell in row)


def play():
    """Main game loop managing board setup, player turns, and end states."""
    board = [[" " for _ in range(3)] for _ in range(3)]
    current_player = "X"

    print("Welcome to Tic Tac Toe!")

    while True:
        display_board(board)

        # Get player move
        row, col = player_input(current_player, board)
        board[row][col] = current_player

        # Check win or tie
        if check_win(board, current_player):
            display_board(board)
            print(f"🎉 Congratulations! Player '{current_player}' wins!")
            break

        if check_tie(board):
            display_board(board)
            print("🤝 It's a tie!")
            break

        # Switch turns
        current_player = "O" if current_player == "X" else "X"


if __name__ == "__main__":
    play()