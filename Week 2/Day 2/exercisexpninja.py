import os
import random
import time


class Cell:

    def __init__(self, state=0):
        # 1 = Alive, 0 = Dead
        self.state = state

    def is_alive(self):
        return self.state == 1

    def set_alive(self):
        self.state = 1

    def set_dead(self):
        self.state = 0

    def __str__(self):
        # Visual representations for terminal rendering
        return "█" if self.state == 1 else " "


class GameOfLife:

    def __init__(self, rows=20, cols=40):
        self.rows = rows
        self.cols = cols
        self.grid = [
            [Cell(0) for _ in range(self.cols)] for _ in range(self.rows)
        ]

    def randomize(self, density=0.25):
        """Populate the grid randomly based on a density percentage."""
        for r in range(self.rows):
            for c in range(self.cols):
                if random.random() < density:
                    self.grid[r][c].set_alive()

    def set_pattern(self, pattern, start_r=0, start_c=0):
        """Load predefined shapes into the grid."""
        for r, line in enumerate(pattern):
            for c, char in enumerate(line):
                if 0 <= start_r + r < self.rows and 0 <= start_c + c < self.cols:
                    if char == "1":
                        self.grid[start_r + r][start_c + c].set_alive()
                    else:
                        self.grid[start_r + r][start_c + c].set_dead()

    def count_neighbors(self, r, c):
        """Count live neighbors around a given (r, c) cell with fixed borders."""
        live_count = 0
        for dr in (-1, 0, 1):
            for dc in (-1, 0, 1):
                if dr == 0 and dc == 0:
                    continue

                nr, nc = r + dr, c + dc
                # Fixed borders: out of bounds cells are treated as dead (0)
                if 0 <= nr < self.rows and 0 <= nc < self.cols:
                    if self.grid[nr][nc].is_alive():
                        live_count += 1
        return live_count

    def step(self):
        """Advance the universe by one generation step."""
        next_grid_states = [
            [0 for _ in range(self.cols)] for _ in range(self.rows)
        ]

        for r in range(self.rows):
            for c in range(self.cols):
                neighbors = self.count_neighbors(r, c)
                is_alive = self.grid[r][c].is_alive()

                # Conway's Rules:
                if is_alive and (neighbors == 2 or neighbors == 3):
                    next_grid_states[r][c] = 1
                elif not is_alive and neighbors == 3:
                    next_grid_states[r][c] = 1
                else:
                    next_grid_states[r][c] = 0

        # Apply the new generation states back to the Cell objects
        for r in range(self.rows):
            for c in range(self.cols):
                if next_grid_states[r][c] == 1:
                    self.grid[r][c].set_alive()
                else:
                    self.grid[r][c].set_dead()

    def display(self, generation):
        """Render grid to the console."""
        os.system("cls" if os.name == "nt" else "clear")
        print(f"--- Conway's Game of Life | Generation: {generation} ---")
        border = "+" + "-" * self.cols + "+"
        print(border)
        for row in self.grid:
            print("|" + "".join(str(cell) for cell in row) + "|")
        print(border)

    def run(self, generations=50, delay=0.1):
        """Run the simulation loop."""
        for gen in range(1, generations + 1):
            self.display(gen)
            self.step()
            time.sleep(delay)


# Example Patterns
GLIDER = ["010", "001", "111"]

PULSAR = [
    "0011100011100",
    "0000000000000",
    "1000010100001",
    "1000010100001",
    "1000010100001",
    "0011100011100",
    "0000000000000",
    "0011100011100",
    "1000010100001",
    "1000010100001",
    "1000010100001",
    "0000000000000",
    "0011100011100",
]


# Initialize and Run Simulation
if __name__ == "__main__":
    game = GameOfLife(rows=20, cols=40)

    # Option A: Random grid setup
    game.randomize(density=0.2)

    # Option B: Preset patterns (Uncomment to use Glider or Pulsar)
    # game.set_pattern(GLIDER, start_r=1, start_c=1)
    # game.set_pattern(PULSAR, start_r=3, start_c=13)

    game.run(generations=60, delay=0.1)