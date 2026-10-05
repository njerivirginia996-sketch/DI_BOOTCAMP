import random


class Card:
    def __init__(self, suit, value):
        self.suit = suit
        self.value = value

    def __str__(self):
        return f"{self.value} of {self.suit}"

    def __repr__(self):
        return f"Card({self.suit!r}, {self.value!r})"


class Deck:
    SUITS = ["Hearts", "Diamonds", "Clubs", "Spades"]
    VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

    def __init__(self):
        self.cards = self._build_full_deck()

    def _build_full_deck(self):
        return [Card(suit, value) for suit in self.SUITS for value in self.VALUES]

    def shuffle(self):
        # Make sure the deck has all 52 cards, then shuffle
        if len(self.cards) != 52:
            self.cards = self._build_full_deck()
        random.shuffle(self.cards)

    def deal(self):
        # Remove and return a single card from the deck
        if not self.cards:
            return None  # deck is empty
        return self.cards.pop()


# Testing
deck = Deck()
print(len(deck.cards))   # 52

deck.shuffle()
card = deck.deal()
print(card)              # e.g. "7 of Clubs"
print(len(deck.cards))   # 51

# Shuffling after dealing restores the full deck first
deck.shuffle()
print(len(deck.cards))   # 52