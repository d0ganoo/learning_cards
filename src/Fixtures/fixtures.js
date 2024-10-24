// fixtures.js
module.exports = [
  {
    model: 'User',
    data: {
      lastname: 'Dupont',
      firstname: 'Alice',
      username: 'alice_dupont',
      email: 'alice.dupont@example.com',
      password: '$2a$12$f/tSHfJouEUzgJq47SV/6.QHHMaj7ib1Rj.xV.VZmS/jkt720TCNC', // motdepasse123
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
      password: '$2a$12$84ivTj7PyQch20o4RVHwgul.0lNps0pu0JeMwbewbwCsF7Cau99Je', // secret123
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
      password: '$2a$12$/DFe8TdWKVu2t8aJcvykgOsK7V6YXguEh2TKe9kRwYwae3qFh.60i', // password456
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },

  // Fixtures pour les Decks
  {
    model: 'Deck',
    data: {
      name: 'Capitales Europe',
      ownerId: 1,
    },
  },
  {
    model: 'Deck',
    data: {
      name: 'Capitales Asie',
      ownerId: 2,
    },
  },
  {
    model: 'Deck',
    data: {
      name: 'Capitales Amérique',
      ownerId: 2,
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
      ownerId: 2,
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
      ownerId: 1,
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
      ownerId: 3,
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
      ownerId: 3,
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
      ownerId: 1,
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
      ownerId: 1,
    },
  },


  // Ajoute d'autres fixtures si nécessaire
];