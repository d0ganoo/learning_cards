// fixtures.js
module.exports = [
  // Fixtures pour les Decks
  {
    model: 'Deck',
    data: {
      name: 'Capitales Europe',
    },
  },
  {
    model: 'Deck',
    data: {
      name: 'Capitales Asie',
    },
  },
  {
    model: 'Deck',
    data: {
      name: 'Capitales Amérique',
    },
  },

  // Fixtures pour les Flashcards liées au Deck "Capitales Europe"
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale de la France ?',
      answer: 'Paris',
      indice: 'La tour Eiffel se trouve dans cette ville.',
      additionalAnswer: 'Londres',
      deckId: 1,
    },
  },
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale de l\'Allemagne ?',
      answer: 'Berlin',
      indice: 'La Porte de Brandebourg est un célèbre monument de cette ville.',
      additionalAnswer: 'Rome',
      deckId: 1,
    },
  },

  // Fixtures pour les Flashcards liées au Deck "Capitales Asie"
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale du Japon ?',
      answer: 'Tokyo',
      indice: 'Le mont Fuji est situé près de cette ville.',
      additionalAnswer: 'Pékin',
      deckId: 2,
    },
  },
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale de l\'Inde ?',
      answer: 'New Delhi',
      indice: 'Le Taj Mahal est un célèbre monument de cette ville.',
      additionalAnswer: 'Bangkok',
      deckId: 2,
    },
  },

  // Fixtures pour les Flashcards liées au Deck "Capitales Amérique"
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale des États-Unis ?',
      answer: 'Washington D.C.',
      indice: 'Le Capitole est situé dans cette ville.',
      additionalAnswer: 'Ottawa',
      deckId: 3,
    },
  },
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale du Brésil ?',
      answer: 'Brasilia',
      indice: 'Cette ville a été spécialement conçue pour être la capitale du pays.',
      additionalAnswer: 'Buenos Aires',
      deckId: 3,
    },
  },
  // Ajoute d'autres fixtures si nécessaire
];
