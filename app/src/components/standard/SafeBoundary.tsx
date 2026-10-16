import { Component, type ErrorInfo, type ReactNode } from 'react';

interface SafeBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface SafeBoundaryState {
    failed: boolean;
}

export class SafeBoundary extends Component<SafeBoundaryProps, SafeBoundaryState> {
    state: SafeBoundaryState = { failed: false };

    static getDerivedStateFromError(): SafeBoundaryState {
        return { failed: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error(error, info.componentStack);
    }

    render() {
        return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
    }
}
