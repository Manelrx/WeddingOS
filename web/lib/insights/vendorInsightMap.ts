import {
    Briefcase,
    Camera,
    Music,
    Utensils,
    Wine,
    Flower2,
    Armchair,
    Home,
    Lightbulb,
    Video
} from 'lucide-react';

const HIGHLIGHTS_MAP: Record<string, string[]> = {
    'buffet': ['Bebidas alcoólicas incluídas?', 'Taxa de rolha', 'Duração do serviço', 'Equipe de garçons'],
    'fotografia': ['Horas de cobertura', 'Quantidade de fotos entregues', 'Prazo de entrega', 'Álbum impresso', 'Drone'],
    'filmagem': ['Horas de cobertura', 'Teaser/Trailer', 'Vídeo na íntegra', 'Drone', 'Prazo de entrega'],
    'decoração': ['Flores naturais', 'Mobiliário incluído', 'Iluminação cênica', 'Buquê da noiva', 'Cerimônia e Recepção'],
    'música': ['Sonorização cerimônia', 'Iluminação pista', 'DJ vs Banda', 'Tempo de apresentação', 'ECAD'],
    'cerimonial': ['Assessoria completa vs dia', 'RSVP ativo', 'Número de assistentes', 'Reuniões presenciais'],
    'espaço': ['Gerador', 'Limpeza', 'Segurança', 'Estacionamento', 'Horário de término'],
    'default': ['Forma de pagamento', 'Política de cancelamento', 'Validade da proposta']
};

export function getHighlightsForCategory(category: string): string[] {
    const normalized = category?.toLowerCase().trim() || 'default';
    // Simple partial match or direct map
    for (const key of Object.keys(HIGHLIGHTS_MAP)) {
        if (normalized.includes(key)) return HIGHLIGHTS_MAP[key];
    }
    return HIGHLIGHTS_MAP['default'];
}
