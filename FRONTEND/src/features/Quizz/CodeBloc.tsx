import React, { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css'; // Style de Highlight.js

// Fonction pour formater le code et appliquer la mise en surbrillance
const formatCode = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Sélectionner tous les blocs de code <pre><code>
  const codeBlocks = doc.querySelectorAll('pre code');

  codeBlocks.forEach((block: any) => {
    // Appliquer le surlignage de Highlight.js sur chaque bloc de code
    hljs.highlightElement(block);
  });

  return doc.body.innerHTML; // Retourner le HTML formaté
};

interface CodeBlockProps {
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const codeRef = useRef<HTMLDivElement | null>(null);

  // Utiliser useEffect pour appliquer la mise en surbrillance après le premier rendu
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current); // Applique la mise en surbrillance au bloc de code
    }
  }, [code]); // Ne s'exécute que lorsque `code` change

  // Formater le code en HTML avant de le rendre
  const formattedCode = formatCode(`<pre class="language-${language}"><code>${code}</code></pre>`);

  return (
    <div
      ref={codeRef}
      className={`language-${language}`}
      style={{
        whiteSpace: 'pre-wrap',      // Préserve l'indentation du code
        wordBreak: 'break-word',     // Permet de casser les mots trop longs
        textAlign: 'left',           // Aligne le code à gauche
        maxHeight: '300px',          // Limite la hauteur à 300px
        overflowY: 'auto',           // Rend le conteneur défilable verticalement
        paddingLeft: '15px',         // Padding à gauche
        paddingRight: '15px',        // Padding à droite
      }}
      dangerouslySetInnerHTML={{ __html: formattedCode }} // Injecte le HTML formaté
    />
  );
};
