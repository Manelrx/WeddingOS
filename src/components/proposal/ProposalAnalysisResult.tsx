import { AnalysisResult } from '@/schemas';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, AlertTriangle, XCircle, Check, X } from 'lucide-react';

export function ProposalAnalysisResult({ result }: { result: AnalysisResult }) {
    const formatCurrency = (val: number | null) =>
        val ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val) : 'Sob Consulta';

    const hasPrice = result.valor_total && result.valor_total > 0;
    // Map internal logic to available Badge statuses: default, analisando, negociação, fechado, descartado
    const badgeStatus = hasPrice ? 'fechado' : 'negociação';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease-in' }}>

            {/* Header Status */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#166534',
                backgroundColor: '#dcfce7',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                border: '1px solid #bbf7d0'
            }}>
                <CheckCircle2 size={16} />
                Análise concluída com sucesso
            </div>

            {/* Financial Summary */}
            <div className="card" style={{ backgroundColor: '#fafaf9', borderColor: 'var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div>
                        <h3 className="label" style={{ marginBottom: '0.25rem' }}>Valor Estimado</h3>
                        <div style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1 }}>
                            {formatCurrency(result.valor_total)}
                        </div>
                    </div>
                    <Badge status={badgeStatus}>
                        {hasPrice ? 'Com Preço' : 'Orçamento Pendente'}
                    </Badge>
                </div>

                <div style={{ fontSize: '0.875rem' }}>
                    <span className="label" style={{ display: 'inline', marginRight: '0.25rem' }}>Condições: </span>
                    {result.condicoes_pagamento || 'Não informadas'}
                </div>
            </div>

            {/* Scope Map */}
            <div className="card">
                <h3 className="title" style={{ fontSize: '1.125rem', marginBottom: '1rem' }}>Mapa de Escopo</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {result.mapa_escopo.map((item, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            paddingBottom: '0.75rem',
                            borderBottom: idx < result.mapa_escopo.length - 1 ? '1px solid var(--border)' : 'none'
                        }}>
                            <div style={{ flex: 1, paddingRight: '1rem' }}>
                                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                                    {item.categoria}
                                </div>
                                <div style={{ fontWeight: 500, fontSize: '1rem' }}>{item.item}</div>
                                {item.detalhe && (
                                    <div style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>{item.detalhe}</div>
                                )}
                            </div>
                            <div style={{ paddingLeft: '1rem', minWidth: '80px', textAlign: 'right' }}>
                                {item.incluso ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
                                        <Check size={16} style={{ marginRight: '0.25rem' }} /> Incluso
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                                        <X size={16} style={{ marginRight: '0.25rem' }} /> Não
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Risks */}
            {result.pontos_atencao.length > 0 && (
                <div className="card" style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2' }}>
                    <h3 className="title" style={{ fontSize: '1.125rem', color: '#b91c1c', marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                        <AlertTriangle size={20} style={{ marginRight: '0.5rem' }} />
                        Pontos de Atenção
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {result.pontos_atencao.map((risk, idx) => (
                            <li key={idx} style={{ color: '#991b1b', fontSize: '0.875rem', display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ marginRight: '0.5rem', marginTop: '0.375rem', width: '0.375rem', height: '0.375rem', backgroundColor: '#f87171', borderRadius: '50%', flexShrink: 0 }} />
                                {risk}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
