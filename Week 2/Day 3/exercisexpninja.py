#exercise 1
from abc import ABC, abstractmethod


class Temperature(ABC):
    """Base class for a temperature value in a specific scale."""

    def __init__(self, degrees: float):
        self.degrees = degrees

    @abstractmethod
    def to_kelvin(self) -> float:
        """Convert this temperature's value to Kelvin (the reference unit)."""
        ...

    @classmethod
    @abstractmethod
    def from_kelvin(cls, kelvin: float) -> "Temperature":
        """Construct an instance of this scale from a Kelvin value."""
        ...

    def convert_to(self, target_cls: type) -> "Temperature":
        """Generic conversion: go through Kelvin, then build the target scale.

        Adding a new scale only requires a new Temperature subclass —
        this method never needs to change.
        """
        kelvin_value = self.to_kelvin()
        return target_cls.from_kelvin(kelvin_value)

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}({self.degrees:.2f}°)"

    def __eq__(self, other):
        if not isinstance(other, Temperature):
            return NotImplemented
        return abs(self.to_kelvin() - other.to_kelvin()) < 1e-9


class Celsius(Temperature):
    def to_kelvin(self) -> float:
        return self.degrees + 273.15

    @classmethod
    def from_kelvin(cls, kelvin: float) -> "Celsius":
        return cls(kelvin - 273.15)


class Kelvin(Temperature):
    def to_kelvin(self) -> float:
        return self.degrees

    @classmethod
    def from_kelvin(cls, kelvin: float) -> "Kelvin":
        return cls(kelvin)


class Fahrenheit(Temperature):
    def to_kelvin(self) -> float:
        celsius = (self.degrees - 32) * 5 / 9
        return celsius + 273.15

    @classmethod
    def from_kelvin(cls, kelvin: float) -> "Fahrenheit":
        celsius = kelvin - 273.15
        return cls(celsius * 9 / 5 + 32)


if __name__ == "__main__":
    boiling_c = Celsius(100)
    boiling_f = boiling_c.convert_to(Fahrenheit)
    boiling_k = boiling_c.convert_to(Kelvin)

    print(boiling_c)  # Celsius(100.00°)
    print(boiling_f)  # Fahrenheit(212.00°)
    print(boiling_k)  # Kelvin(373.15°)

    # Adding Rankine later requires ONE new class, zero edits elsewhere:
    class Rankine(Temperature):
        def to_kelvin(self) -> float:
            return self.degrees * 5 / 9

        @classmethod
        def from_kelvin(cls, kelvin: float) -> "Rankine":
            return cls(kelvin * 9 / 5)

    print(boiling_c.convert_to(Rankine))  # Rankine(671.67°)
    
    
#exercise 2
import random


class QuantumParticle:
    """A whimsical simulation of a quantum particle with position, momentum
    and spin. Every measurement disturbs the particle (position & momentum
    get re-randomized), and particles can be entangled so that measuring
    one's spin instantly determines the other's."""

    def __init__(self, x=None, y=None, p=None, name=None):
        # Internal state — kept separate from the measurement methods
        # below (which share the same names: position, momentum, spin).
        self._position = x if x is not None else random.randint(1, 10_000)
        self._momentum = y if y is not None else random.random()
        self._spin = p if p is not None else random.choice([0.5, -0.5])

        self._entangled_with = None
        self.name = name or f"Particle-{id(self) % 10000}"

    # --- Disturbance -----------------------------------------------------

    def _disturb(self):
        """Every measurement perturbs position and momentum."""
        self._position = random.randint(1, 10_000)
        self._momentum = random.random()
        print('Quantum Interferences!!')

    # --- Measurements ------------------------------------------------------

    def position(self):
        """Measure position: disturbs the particle, returns the new position."""
        self._disturb()
        return self._position

    def momentum(self):
        """Measure momentum: disturbs the particle, returns the new momentum."""
        self._disturb()
        return self._momentum

    def spin(self):
        """Measure spin. Disturbs the particle, randomly collapses spin to
        +1/2 or -1/2, and — if entangled — forces the partner's spin to the
        opposite value instantly."""
        self._disturb()
        self._spin = random.choice([0.5, -0.5])

        if self._entangled_with is not None:
            self._entangled_with._spin = -self._spin

        return self._spin

    # --- Entanglement ------------------------------------------------------

    def entangle(self, other):
        """Entangle this particle with another QuantumParticle."""
        if not isinstance(other, QuantumParticle):
            raise TypeError(
                "A QuantumParticle can only be entangled with another QuantumParticle"
            )

        self._entangled_with = other
        other._entangled_with = self
        print('Spooky Action at a Distance !!')

    # --- Representation ------------------------------------------------------

    def __repr__(self):
        entangled_name = self._entangled_with.name if self._entangled_with else None
        return (
            f"<QuantumParticle {self.name} | position={self._position}, "
            f"momentum={self._momentum:.4f}, spin={self._spin:+}, "
            f"entangled_with={entangled_name}>"
        )