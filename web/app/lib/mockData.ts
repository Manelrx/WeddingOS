import { ComparisonMatrix } from "@/app/types/comparison";

export const MOCK_COMPARISON_MATRIX: ComparisonMatrix = {
    weddingId: "1",
    serviceType: "buffet",
    criteria: [
        { key: "cardapio-entradas", label: "Entradas / Canapés", category: "Gastronomia" },
        { key: "cardapio-jantar", label: "Jantar Principal", category: "Gastronomia" },
        { key: "bebidas-alcoolicas", label: "Bebidas Alcoólicas", category: "Bebidas" },
        { key: "staff-garcons", label: "Equipe de Garçons", category: "Serviço" },
        { key: "decoracao-mesa", label: "Decoração de Mesa", category: "Estrutura" },
        { key: "taxa-deslocamento", label: "Taxa de Deslocamento", category: "Financeiro" },
    ],
    proposals: [
        {
            proposalId: "p1",
            vendorName: "Buffet Sabor Divino",
            totalValue: 25000,
            items: {
                "cardapio-entradas": { status: "included", originalName: "Canapés variados (10 tipos)" },
                "cardapio-jantar": { status: "included", originalName: "Jantar Franco-Americano" },
                "bebidas-alcoolicas": { status: "not_included", notes: "Apenas cerveja e refrigerante inclusos" },
                "staff-garcons": { status: "included", originalName: "1 garçom para cada 15 convidados" },
                "decoracao-mesa": { status: "included", originalName: "Toalhas e arranjos florais básicos" },
                "taxa-deslocamento": { status: "included", notes: "Até 50km de SP" },
            },
        },
        {
            proposalId: "p2",
            vendorName: "Cozinha da Maria",
            totalValue: 22000,
            items: {
                "cardapio-entradas": { status: "included", originalName: "Salgados fritos e assados" },
                "cardapio-jantar": { status: "included", originalName: "Massas e Risotos" },
                "bebidas-alcoolicas": { status: "not_informed", notes: "Não encontrei menção a bebidas no PDF" },
                "staff-garcons": { status: "included", originalName: "Equipe completa" },
                "decoracao-mesa": { status: "not_included", notes: "Locação de toalhas à parte" },
                "taxa-deslocamento": { status: "not_informed" },
            },
        },
        {
            proposalId: "p3",
            vendorName: "Gastrô Premium",
            totalValue: 32000,
            items: {
                "cardapio-entradas": { status: "included", originalName: "Finger foods gourmet" },
                "cardapio-jantar": { status: "included", originalName: "Menu Degustação 5 tempos" },
                "bebidas-alcoolicas": { status: "included", originalName: "Open Bar Completo (Gin, Vodka, Whisky)" },
                "staff-garcons": { status: "included", originalName: "1 garçom para cada 10 convidados + Maitre" },
                "decoracao-mesa": { status: "included", originalName: "Decoração completa com sousplat" },
                "taxa-deslocamento": { status: "included", notes: "Isento" },
            },
        },
    ],
};
