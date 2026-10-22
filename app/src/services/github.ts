export const GITHUB_USER = 'leopettersen';

const API = 'https://api.github.com';
const CACHE_KEY = 'github-summary';
const CACHE_TTL = 60 * 60 * 1000;
const RECENT_COUNT = 3;
const LANGUAGE_COUNT = 4;

export interface GithubRepo {
    name: string;
    url: string;
    language: string | null;
    pushedAt: string;
}

export interface GithubLanguage {
    name: string;
    percent: number;
}

export interface GithubSummary {
    name: string;
    login: string;
    avatarUrl: string;
    profileUrl: string;
    publicRepos: number;
    followers: number;
    recent: GithubRepo[];
    languages: GithubLanguage[];
}

interface ApiUser {
    name: string | null;
    login: string;
    avatar_url: string;
    html_url: string;
    public_repos: number;
    followers: number;
}

interface ApiRepo {
    name: string;
    html_url: string;
    language: string | null;
    pushed_at: string;
    fork: boolean;
}

function readCache(): GithubSummary | null {
    try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;

        const { savedAt, data } = JSON.parse(raw) as { savedAt: number; data: GithubSummary };
        return Date.now() - savedAt < CACHE_TTL ? data : null;
    } catch {
        return null;
    }
}

function writeCache(data: GithubSummary) {
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
    } catch {
    }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
    const response = await fetch(`${API}${path}`, { headers: { Accept: 'application/vnd.github+json' }, signal });
    if (!response.ok) throw new Error(`GitHub ${response.status}`);
    return response.json() as Promise<T>;
}

function topLanguages(repos: ApiRepo[]): GithubLanguage[] {
    const counts = new Map<string, number>();
    for (const repo of repos) {
        if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
    }

    const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, LANGUAGE_COUNT)
        .map(([name, count]) => ({ name, percent: Math.round((count / total) * 100) }));
}

export async function fetchGithubSummary(signal?: AbortSignal): Promise<GithubSummary> {
    const cached = readCache();
    if (cached) return cached;

    const [user, allRepos] = await Promise.all([
        getJson<ApiUser>(`/users/${GITHUB_USER}`, signal),
        getJson<ApiRepo[]>(`/users/${GITHUB_USER}/repos?per_page=100&sort=pushed&type=owner`, signal),
    ]);

    const repos = allRepos.filter((repo) => !repo.fork);

    const data: GithubSummary = {
        name: user.name ?? user.login,
        login: user.login,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
        publicRepos: user.public_repos,
        followers: user.followers,
        recent: repos.slice(0, RECENT_COUNT).map((repo) => ({
            name: repo.name,
            url: repo.html_url,
            language: repo.language,
            pushedAt: repo.pushed_at,
        })),
        languages: topLanguages(repos),
    };

    writeCache(data);
    return data;
}
