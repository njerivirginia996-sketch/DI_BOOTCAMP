import math


class Circle:
	def __init__(self, radius):
		if radius < 0:
			raise ValueError("radius must be non-negative")
		self.radius = radius

	@classmethod
	def from_diameter(cls, diameter):
		if diameter < 0:
			raise ValueError("diameter must be non-negative")
		return cls(diameter / 2)

	@property
	def diameter(self):
		return self.radius * 2

	def area(self):
		return math.pi * self.radius**2

	def __str__(self):
		return f"Circle(radius={self.radius:g}, diameter={self.diameter:g})"

	def __repr__(self):
		return f"Circle({self.radius!r})"

	def __add__(self, other):
		if not isinstance(other, Circle):
			return NotImplemented
		return Circle(self.radius + other.radius)

	def __gt__(self, other):
		if not isinstance(other, Circle):
			return NotImplemented
		return self.radius > other.radius

	def __eq__(self, other):
		if not isinstance(other, Circle):
			return NotImplemented
		return self.radius == other.radius

	def __lt__(self, other):
		if not isinstance(other, Circle):
			return NotImplemented
		return self.radius < other.radius


if __name__ == "__main__":
	small = Circle(3)
	medium = Circle.from_diameter(10)
	large = Circle(8)
	circles = [large, small, medium]

	print(small)
	print(f"Area: {small.area():.2f}")
	print(f"Small + medium: {small + medium}")
	print(f"Large > medium: {large > medium}")
	print(f"Medium == Circle(5): {medium == Circle(5)}")
	print(f"Sorted circles: {sorted(circles)}")
