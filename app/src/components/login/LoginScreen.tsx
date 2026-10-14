import { User } from 'lucide-react';

interface LoginScreenProps {
    onEnter: () => void;
}

export function LoginScreen({ onEnter }: LoginScreenProps) {
    return (
        <div className="fixed inset-0 z-50 bg-slate-950 font-mono flex flex-col items-center justify-center gap-6">
            <div className="h-28 w-28 rounded-full bg-slate-700/60 flex items-center justify-center">
                <User size={56} aria-hidden color="white"/>
            </div>

            <h1 className="text-2xl font-semibold text-zinc-100">
                Guest
            </h1>

            <button
                type="button"
                onClick={onEnter}
                autoFocus
                className="border border-slate-700/60 px-4 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:border-slate-500 hover:bg-slate-800/60 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
            >
                Enter
            </button>
        </div>
    );
}
