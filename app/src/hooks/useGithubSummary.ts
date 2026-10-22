import { useEffect, useState } from 'react';
import { fetchGithubSummary, type GithubSummary } from '../services/github';

export function useGithubSummary(enabled: boolean) {
    const [summary, setSummary] = useState<GithubSummary | null>(null);

    useEffect(() => {
        if (!enabled) return;

        const controller = new AbortController();

        fetchGithubSummary(controller.signal)
            .then(setSummary)
            .catch((error: unknown) => {
                if (error instanceof Error && error.name === 'AbortError') return;
                console.error(error);
            });

        return () => controller.abort();
    }, [enabled]);

    return summary;
}
