'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/proxy/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erro ao criar conta. E-mail já em uso.');
            }

            const data = await res.json();
            // server sets cookie via HttpOnly
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#f8f6f6] overflow-x-hidden p-6 justify-center items-center" style={{
            backgroundImage: `
          radial-gradient(at 0% 0%, rgba(232, 48, 110, 0.15) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(232, 48, 110, 0.1) 0px, transparent 50%),
          radial-gradient(at 50% 0%, rgba(232, 48, 110, 0.05) 0px, transparent 50%)
        `
        }}>

            <div className="bg-white/70 backdrop-blur-xl border border-white/30 w-full max-w-[400px] rounded-3xl p-8 shadow-2xl shadow-[#e8306e]/5 z-10">
                <div className="mb-8 text-center flex flex-col items-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#e8306e]/10 rounded-full mb-4">
                        <span className="material-symbols-outlined text-[#e8306e] text-3xl leading-none">favorite</span>
                    </div>
                    <h1 className="text-slate-900 text-3xl font-bold tracking-tight">WeddingOS</h1>
                    <p className="text-slate-600 mt-2 text-sm">Crie sua conta e comece a planejar seu caso de amor.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-slate-700 text-sm font-semibold ml-1">Nome</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">person</span>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-12 pr-4 h-14 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#e8306e] focus:border-transparent transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                placeholder="Seu nome"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-slate-700 text-sm font-semibold ml-1">E-mail</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 h-14 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#e8306e] focus:border-transparent transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                placeholder="casal@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-slate-700 text-sm font-semibold ml-1">Senha</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 h-14 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#e8306e] focus:border-transparent transition-all outline-none text-slate-900 placeholder:text-slate-400"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-[#e8306e] text-white font-bold rounded-xl shadow-lg shadow-[#e8306e]/20 hover:bg-[#e8306e]/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
                    >
                        {loading ? 'Criando Conta...' : 'Criar Conta'}
                        {!loading && <span className="material-symbols-outlined text-xl">arrow_forward</span>}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm">
                    <p className="text-slate-600">
                        Já tem uma conta? {' '}
                        <Link href="/login" className="text-[#e8306e] font-bold hover:underline underline-offset-4 decoration-2">
                            Entre aqui
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
