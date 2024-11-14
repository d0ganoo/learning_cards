export type deckType = {
    id: number;
    name: string;
}
export type CardType = {
    id: number;
    question: string;
    answer: string;
    indice: string | null;
    additionalAnswer: string | null;
    visibility: "private" | "public";
}