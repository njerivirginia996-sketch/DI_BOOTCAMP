#exercise 1
import json

sampleJson = """{ 
   "company":{ 
      "employee":{ 
         "name":"emma",
         "payable":{ 
            "salary":7000,
            "bonus":800
         }
      }
   }
}"""

# Step 1: Parse JSON string to Python dictionary
data = json.loads(sampleJson)

# Step 2: Access nested keys
salary = data["company"]["employee"]["payable"]["salary"]
bonus = data["company"]["employee"]["payable"]["bonus"]

# Step 3: Print the results
print("Salary:", salary)
print("Bonus:", bonus)


#exercise 2
"""
Dungeons & Dragons Character Generator
========================================

Generates player characters with randomly rolled ability scores
(4d6, drop lowest, repeated for each of the six abilities), then
exports all characters to a formatted .txt file and a .json file.

Run it with:  python dnd_character_generator.py
"""

import json
import random
from datetime import datetime


class Character:
    """Represents a single Dungeons & Dragons character.

    Responsible for creating itself: rolling ability scores and
    storing the player-supplied name/age.
    """

    ABILITIES = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma",
    ]

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age
        self.abilities = self._generate_abilities()

    @staticmethod
    def _roll_ability_score() -> int:
        """Roll 4d6 and return the sum of the highest 3 dice."""
        rolls = [random.randint(1, 6) for _ in range(4)]
        rolls.sort(reverse=True)
        return sum(rolls[:3])

    def _generate_abilities(self) -> dict:
        """Roll a score for every ability in ABILITIES."""
        return {ability: self._roll_ability_score() for ability in self.ABILITIES}

    def to_dict(self) -> dict:
        """Return a plain-dict representation, handy for JSON export."""
        return {
            "name": self.name,
            "age": self.age,
            "abilities": self.abilities,
        }

    def to_text_block(self) -> str:
        """Return a nicely formatted multi-line text block for this character."""
        lines = [
            f"Name: {self.name}",
            f"Age:  {self.age}",
            "-" * 30,
        ]
        for ability in self.ABILITIES:
            score = self.abilities[ability]
            lines.append(f"  {ability:<14}: {score}")
        return "\n".join(lines)

    def __repr__(self):
        return f"Character(name={self.name!r}, age={self.age})"


class Game:
    """Runs the character-creation session for a group of players.

    Responsible for asking how many players there are, driving the
    creation of one Character per player, and exporting the whole
    party to .txt and .json files.
    """

    def __init__(self):
        self.characters: list[Character] = []

    def _ask_number_of_players(self) -> int:
        while True:
            raw = input("How many players are playing? ").strip()
            if raw.isdigit() and int(raw) > 0:
                return int(raw)
            print("Please enter a positive whole number.")

    def _ask_age(self, player_number: int) -> int:
        while True:
            raw = input(f"  Age for player {player_number}'s character: ").strip()
            if raw.isdigit() and int(raw) > 0:
                return int(raw)
            print("  Please enter a valid age (positive whole number).")

    def create_characters(self):
        """Ask how many players there are, then build one Character each."""
        num_players = self._ask_number_of_players()

        for i in range(1, num_players + 1):
            print(f"\nPlayer {i}, let's create your character.")
            name = input(f"  Name for player {i}'s character: ").strip()
            age = self._ask_age(i)

            character = Character(name=name, age=age)
            self.characters.append(character)

            print(f"  -> {character.name} created!")
            print(character.to_text_block())

    def export_to_txt(self, filepath: str):
        """Write all characters to a nicely formatted .txt file."""
        with open(filepath, "w", encoding="utf-8") as f:
            f.write("=" * 40 + "\n")
            f.write("   DUNGEONS & DRAGONS - PARTY ROSTER\n")
            f.write("=" * 40 + "\n")
            f.write(f"Generated: {datetime.now():%Y-%m-%d %H:%M:%S}\n")
            f.write(f"Number of characters: {len(self.characters)}\n\n")

            for idx, character in enumerate(self.characters, start=1):
                f.write(f"Character #{idx}\n")
                f.write("=" * 30 + "\n")
                f.write(character.to_text_block())
                f.write("\n\n")

    def export_to_json(self, filepath: str):
        """Write all characters to a .json file."""
        data = {
            "generated": datetime.now().isoformat(),
            "num_characters": len(self.characters),
            "characters": [c.to_dict() for c in self.characters],
        }
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4)

    def run(self, txt_path: str = "characters.txt", json_path: str = "characters.json"):
        """Full flow: create characters, then export them both formats."""
        self.create_characters()
        self.export_to_txt(txt_path)
        self.export_to_json(json_path)
        print(f"\nAll characters exported to '{txt_path}' and '{json_path}'.")


if __name__ == "__main__":
    game = Game()
    game.run()