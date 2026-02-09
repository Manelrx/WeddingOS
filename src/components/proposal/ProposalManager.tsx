'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Upload, Loader2, FileText, AlertCircle } from 'lucide-react';
import { analyzeProposalAction } from '@/app/actions-analysis';
import { ProposalAnalysisResult } from './ProposalAnalysisResult';
import { AnalysisResult } from '@/schemas';

type AnalysisState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: AnalysisResult }
    | { status: 'error'; message: string };

export function ProposalManager({ supplierId }: { supplierId: string }) {
    const [state, setState] = useState<AnalysisState>({ status: 'idle' });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setState({ status: 'loading' });
            const formData = new FormData();
            formData.append('file', e.target.files[0]);

            try {
                const response = await analyzeProposalAction(formData);

                if (response.success && response.data) {
                    setState({ status: 'success', data: response.data });
                } else {
                    setState({ status: 'error', message: response.error || 'Falha desconhecida ao analisar.' });
                }
            } catch (err) {
                console.error(err);
                setState({ status: 'error', message: 'Erro de conexão ou servidor.' });
            }
        }
    };

    if (state.status === 'success') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="title" style={{ fontSize: '1.25rem', margin: 0 }}>Análise da Proposta</h2>
                    <Button variant="outline" size="sm" onClick={() => setState({ status: 'idle' })}>
                        Nova Análise
                    </Button>
                </div>

                <ProposalAnalysisResult result={state.data} />
            </div>
        );
    }

    return (
        <div className="card">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{
                    backgroundColor: 'var(--muted)',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem auto'
                }}>
                    {state.status === 'loading' ? <Loader2 className="animate-spin" /> :
                        state.status === 'error' ? <AlertCircle style={{ color: 'var(--destructive, #ef4444)' }} /> :
                            <FileText style={{ color: 'var(--muted-foreground)' }} />}
                </div>

                <h3 className="font-semibold" style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>
                    {state.status === 'loading' ? 'Analisando proposta...' :
                        state.status === 'error' ? 'Erro na Análise' :
                            'Analisar Proposta (PDF)'}
                </h3>

                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                    {state.status === 'loading'
                        ? 'Isso pode levar alguns segundos. Estamos extraindo valores e escopo.'
                        : state.status === 'error'
                            ? state.message
                            : 'Envie o PDF para que nossa IA extraia os dados automaticamente.'}
                </p>

                {state.status === 'idle' && (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Button>
                            <Upload size={16} style={{ marginRight: '0.5rem' }} /> Selecionar PDF
                        </Button>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                )}

                {state.status === 'error' && (
                    <Button variant="outline" onClick={() => setState({ status: 'idle' })}>
                        Tentar Novamente
                    </Button>
                )}
            </div>
        </div>
    );
}
