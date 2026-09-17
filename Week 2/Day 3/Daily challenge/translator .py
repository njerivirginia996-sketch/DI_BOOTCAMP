import asyncio

try:
	from googletrans import Translator
except ImportError as error:
	raise ImportError(
		"Install the dependency with: pip install googletrans==4.0.2"
	) from error


FRENCH_WORDS = ["Bonjour", "Au revoir", "Bienvenue", "A bientôt"]


async def translate_words(words, source_language="fr", target_language="en"):
	translator = Translator()
	try:
		translations = await asyncio.gather(
			*(
				translator.translate(
					word, src=source_language, dest=target_language
				)
				for word in words
			)
		)
		return {word: translation.text for word, translation in zip(words, translations)}
	finally:
		await translator.client.aclose()


if __name__ == "__main__":
	print(asyncio.run(translate_words(FRENCH_WORDS)))
