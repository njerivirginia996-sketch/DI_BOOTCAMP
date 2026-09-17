import random


class GeneticMaterial:
	"""Base class for objects that can mutate and be inspected."""

	def mutate(self):
		raise NotImplementedError

	def is_all_ones(self):
		raise NotImplementedError


class Gene(GeneticMaterial):
	def __init__(self, value=None):
		self.value = random.randint(0, 1) if value is None else value
		if self.value not in (0, 1):
			raise ValueError("A gene must be 0 or 1")

	def mutate(self):
		self.value = 1 - self.value
		return self

	def is_all_ones(self):
		return self.value == 1

	def __str__(self):
		return str(self.value)


class Chromosome(GeneticMaterial):
	def __init__(self, genes=None):
		self.genes = list(genes) if genes is not None else [Gene() for _ in range(10)]
		if len(self.genes) != 10:
			raise ValueError("A chromosome must contain exactly 10 genes")

	def mutate(self):
		number_to_mutate = random.randint(0, len(self.genes))
		for gene in random.sample(self.genes, number_to_mutate):
			if random.random() < 0.5:
				gene.mutate()
		return self

	def is_all_ones(self):
		return all(gene.is_all_ones() for gene in self.genes)

	def __str__(self):
		return "".join(str(gene) for gene in self.genes)


class DNA(GeneticMaterial):
	def __init__(self, chromosomes=None):
		self.chromosomes = (
			list(chromosomes)
			if chromosomes is not None
			else [Chromosome() for _ in range(10)]
		)
		if len(self.chromosomes) != 10:
			raise ValueError("DNA must contain exactly 10 chromosomes")

	def mutate(self):
		number_to_mutate = random.randint(0, len(self.chromosomes))
		for chromosome in random.sample(self.chromosomes, number_to_mutate):
			chromosome.mutate()
		return self

	def is_all_ones(self):
		return all(chromosome.is_all_ones() for chromosome in self.chromosomes)

	def __str__(self):
		return "\n".join(str(chromosome) for chromosome in self.chromosomes)


class Organism:
	def __init__(self, dna, environment):
		if not isinstance(dna, DNA):
			raise TypeError("dna must be a DNA object")
		if not 0 <= environment <= 1:
			raise ValueError("environment must be between 0 and 1")

		self.dna = dna
		self.environment = environment

	def mutate(self):
		if random.random() < self.environment:
			self.dna.mutate()
		return self

	def is_perfect(self):
		return self.dna.is_all_ones()


def run_experiment(population_size=100, environment=0.1, max_generations=100_000):
	"""Mutate a population until a perfect organism appears or the limit is reached."""
	organisms = [Organism(DNA(), environment) for _ in range(population_size)]

	for generation in range(1, max_generations + 1):
		for organism in organisms:
			organism.mutate()
			if organism.is_perfect():
				return organism, generation

	raise RuntimeError(
		f"No perfect organism found after {max_generations:,} generations"
	)


if __name__ == "__main__":
	try:
		organism, generations = run_experiment()
		print(f"A perfect organism appeared after {generations:,} generations.")
		print(organism.dna)
		print("Conclusion: the all-ones DNA was reached through random mutation.")
	except RuntimeError as error:
		print(error)
		print(
			"Conclusion: unbiased random mutation is too unlikely to reach a "
			"100-gene all-ones DNA in a practical experiment."
		)
