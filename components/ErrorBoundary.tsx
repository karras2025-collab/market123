// @ts-nocheck
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#101622] text-white flex items-center justify-center p-4">
                    <div className="max-w-xl w-full bg-[#161b26] border border-[#282e39] rounded-2xl p-8 shadow-2xl">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                                <AlertTriangle className="w-8 h-8" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Что-то пошло не так</h1>
                            <p className="text-gray-400">Произошла ошибка при отрисовке приложения.</p>
                        </div>

                        <div className="bg-black/30 rounded-lg p-4 mb-6 text-left overflow-auto max-h-64 border border-white/5">
                            <p className="text-red-400 font-mono text-sm mb-2 font-bold">
                                {this.state.error && this.state.error.toString()}
                            </p>
                            {this.state.errorInfo && (
                                <pre className="text-gray-500 font-mono text-xs whitespace-pre-wrap">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </div>

                        <div className="flex gap-4 justify-center">
                            <a href="/" className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                <Home className="w-4 h-4" />
                                На главную
                            </a>
                            <button
                                onClick={() => window.location.reload()}
                                className="flex items-center gap-2 px-6 py-2 bg-[#135bec] hover:bg-blue-600 rounded-lg transition-colors font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Перезагрузить
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
