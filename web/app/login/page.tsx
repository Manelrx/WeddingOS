'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/proxy/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error('Credenciais inválidas. Tente novamente.');
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
        <div className="relative flex min-h-screen w-full flex-col bg-[#f8f6f6] overflow-hidden items-center justify-center p-6" style={{
            backgroundImage: `
        radial-gradient(at 0% 0%, rgba(232, 48, 110, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(232, 48, 110, 0.1) 0px, transparent 50%),
        radial-gradient(at 50% 0%, rgba(232, 48, 110, 0.05) 0px, transparent 50%)
      `
        }}>
            {/* Container Principal com Efeito Glassmorphism */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/30 w-full max-w-[400px] rounded-3xl p-8 shadow-2xl shadow-[#e8306e]/5 z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-[#e8306e]/10 p-4 rounded-full mb-4">
                        <span className="material-symbols-outlined text-[#e8306e] text-4xl leading-none">favorite</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2 font-display">WeddingOS</h1>
                    <p className="text-slate-500 text-center text-sm font-display">Acesse sua conta para organizar o grande dia.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">E-mail</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-[#e8306e]/20 transition-all text-slate-900 placeholder:text-slate-400 outline-none"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Senha</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-12 py-4 rounded-2xl border-slate-200 bg-white/50 focus:bg-white focus:ring-2 focus:ring-[#e8306e]/20 transition-all text-slate-900 placeholder:text-slate-400 outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <a href="#" className="text-xs font-semibold text-[#e8306e] hover:opacity-80 transition-opacity">
                            Esqueci minha senha
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#e8306e] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#e8306e]/30 hover:shadow-xl hover:brightness-110 active:scale-[0.98] transition-all mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        Não tem conta? {' '}
                        <Link href="/cadastro" className="text-[#e8306e] font-bold hover:underline transition-all">
                            Cadastre-se
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
