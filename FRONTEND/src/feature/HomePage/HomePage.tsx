import React, { useEffect } from "react";

import { Typography } from "antd";

import styles from "./HomePage.module.css";

import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const { Title } = Typography;

export const HomePage = () => {
  useDocumentTitle("Your prod  - HomePage");

  useEffect(() => {

  });

  return (
    <div className={styles.root}>
        <Title type="secondary" level={1}>
        Bienvenue sur Learning cards ! 
        Ici tu vas pouvoir créer tes propres decks d'apprentissage.
        Mais c'est quoi un deck d'apprentissage ?
        C'est un ensemble de fashcards qui contiennent une question et une réponse.
        IL peut être public ou privé, si il est public, tout le monde peut le voir et l'utiliser.
        Si il est privé, seul toi et les personnes que tu as invité peuvent le voir et l'utiliser.
        Un deck est l'outil parfait pour réviser et apprendre !
        </Title>
        <p>C'est parti pour apprendre !</p>
        <p>Pour commencer, créer ton premier deck d'apprentissage</p>
        <p>Ensuite, tu pourras créer des flashcards et les ajouter à ton deck</p>

        <div>
        <Title type="secondary" level={3}>
          Viens découvrir notre explorer de decks et de flashcards
        </Title>
        <p>Les decks et flashcards des autres utilisateurs sont disponible!</p>
        <p>Récupère les pour enrichir tes révisons !</p>
        </div>
    </div>
  );
};
