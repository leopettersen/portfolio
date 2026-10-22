import { Component, type ErrorInfo, type ReactNode } from 'react';

interface SafeBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
}

interface SafeBoundaryState {
    error: Error | null;
}

export class SafeBoundary extends Component<SafeBoundaryProps, SafeBoundaryState> {
    state: SafeBoundaryState = { error: null };

    static getDerivedStateFromError(error: unknown): SafeBoundaryState {
        return { error: error instanceof Error ? error : new Error(String(error)) };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(error, info.componentStack);
    }

    reset = () => {
        this.setState({ error: null });
    };

    render() {
        const { error } = this.state;
        if (!error) return this.props.children;

        const { fallback } = this.props;
        return typeof fallback === 'function' ? fallback(error, this.reset) : (fallback ?? null);
    }
}
