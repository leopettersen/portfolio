import type { ReactNode } from 'react';

const tones = {
    system: { strong: 'text-slate-200', code: 'bg-slate-700/60 text-slate-300' },
    standard: { strong: 'text-title', code: 'bg-body/15 text-title' },
};

type Tone = keyof typeof tones;

interface MarkdownTextProps {
    text: string;
    tone?: Tone;
}

type Block =
    | { type: 'p'; text: string }
    | { type: 'ul' | 'ol'; items: string[] };

// **negrito**, *itálico* e `código` dentro de uma linha, sem innerHTML
function inline(text: string, keyPrefix: string, tone: Tone): ReactNode[] {
    return text.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|`[^`]+`)/g).map((part, index) => {
        const key = `${keyPrefix}-${index}`;

        if (/^\*\*[^*]+\*\*$/.test(part)) {
            return <strong key={key} className={`font-semibold ${tones[tone].strong}`}>{part.slice(2, -2)}</strong>;
        }
        if (/^`[^`]+`$/.test(part)) {
            return <code key={key} className={`${tones[tone].code} px-1.5 py-0.5 rounded text-sm`}>{part.slice(1, -1)}</code>;
        }
        if (/^\*[^*]+\*$/.test(part)) {
            return <em key={key}>{part.slice(1, -1)}</em>;
        }
        return part;
    });
}

export function MarkdownText({ text, tone = 'system' }: MarkdownTextProps) {
    const blocks: Block[] = [];
    let list: Extract<Block, { items: string[] }> | null = null;

    for (const raw of text.split('\n')) {
        const line = raw.trimEnd();
        const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
        const numbered = /^\s*\d+[.)]\s+(.*)$/.exec(line);
        const item = bullet ?? numbered;

        if (item) {
            const type = bullet ? 'ul' : 'ol';

            if (!list || list.type !== type) {
                list = { type, items: [] };
                blocks.push(list);
            }

            list.items.push(item[1]);
            continue;
        }

        list = null;

        if (line.trim()) {
            blocks.push({ type: 'p', text: line.replace(/^#+\s*/, '') });
        }
    }

    return (
        <div className="flex flex-col gap-2">
            {blocks.map((block, index) => {
                if (block.type === 'p') {
                    return <p key={index}>{inline(block.text, String(index), tone)}</p>;
                }

                const List = block.type;

                return (
                    <List key={index} className={`flex flex-col gap-1 pl-5 ${block.type === 'ul' ? 'list-disc' : 'list-decimal'}`}>
                        {block.items.map((item, itemIndex) => (
                            <li key={itemIndex}>{inline(item, `${index}-${itemIndex}`, tone)}</li>
                        ))}
                    </List>
                );
            })}
        </div>
    );
}
