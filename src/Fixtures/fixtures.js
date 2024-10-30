const usersData = [
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
];

const decksData = [
  {
    model: 'Deck',
    data: {
      name: 'Capitales Europe',
      ownerId: 1, // Référence au premier utilisateur
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    model: 'Deck',
    data: {
      name: 'Capitales Asie',
      ownerId: 2, // Référence au deuxième utilisateur
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    model: 'Deck',
    data: {
      name: 'Capitales Amérique',
      ownerId: 2, // Référence au deuxième utilisateur
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

const flashcardsData = [
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale de la France ?',
      answer: 'Paris',
      indice: 'La tour Eiffel se trouve dans cette ville.',
      additionalAnswer: 'Londres',
      visibility: 'public',  // Ajout du champ visibility
      deckId: 1, // Correspond au deck "Capitales Europe"
      ownerId: 2, // ID correspondant à Bob
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale de l\'Allemagne ?',
      answer: 'Berlin',
      indice: 'La Porte de Brandebourg est un célèbre monument de cette ville.',
      additionalAnswer: 'Rome',
      visibility: 'public',
      deckId: 1,
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale du Japon ?',
      answer: 'Tokyo',
      indice: 'Le mont Fuji est situé près de cette ville.',
      additionalAnswer: 'Pékin',
      visibility: 'public',
      deckId: 2,
      ownerId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  {
    model: 'Flashcard',
    data: {
      question: 'Quelle est la capitale de l\'Inde ?',
      answer: 'New Delhi',
      indice: 'Le Taj Mahal est un célèbre monument de cette ville.',
      additionalAnswer: 'Mumbai',
      visibility: 'private', // Exemple d'une carte de flash avec visibilité différente
      deckId: 2,
      ownerId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
];

module.exports = { usersData, decksData, flashcardsData };
