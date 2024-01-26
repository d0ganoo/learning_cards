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

  {
    model: 'User',
    data: {
      lastname: 'Dupont',
      firstname: 'Alice',
      username: 'alice_dupont',
      email: 'alice.dupont@example.com',
      password: 'motdepasse123', // Assure-toi de stocker les mots de passe de manière sécurisée en production
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    model: 'User',
    data: {
      lastname: 'Martin',
      firstname: 'Bob',
      username: 'bob_martin',
      email: 'bob.martin@example.com',
      password: 'secret123',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    model: 'User',
    data: {
      lastname: 'Lefevre',
      firstname: 'Charles',
      username: 'charles_lefevre',
      email: 'charles.lefevre@example.com',
      password: 'password456',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  // Ajoute d'autres fixtures si nécessaire
];
