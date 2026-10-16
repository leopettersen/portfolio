import { contacts } from '../../data/contacts';

export interface ProfileCardProps {
    name: string;
    picture: string;
}

export function ProfileCard({ name, picture }: ProfileCardProps) {
    return (
        <div className="flex w-[34rem] items-center gap-8 rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 p-8 text-zinc-100">
            <img
                src={picture}
                alt={name}
                className="h-36 w-36 shrink-0 rounded-full border-2 border-blue-500/60 object-cover shadow-lg shadow-black/50"
            />

            <div className="h-40 w-px shrink-0 bg-blue-400/40" />

            <div className="flex min-w-0 flex-col gap-4">
                <h3 className="text-2xl font-bold">{name}</h3>

                <div className="h-px w-full bg-blue-400/40" />

                <ul className="flex flex-col gap-2 text-sm text-slate-300">
                    {contacts.map((contact) => (
                        <li key={contact.name} className="flex items-center gap-2">
                            <contact.icon size={16} className="shrink-0 text-blue-400" />
                            <span className="truncate">{contact.text.replace(' @', '@')}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
