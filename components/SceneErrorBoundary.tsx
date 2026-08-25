'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

type SceneErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: () => void;
};

type SceneErrorBoundaryState = {
  hasError: boolean;
};

class SceneErrorBoundary extends Component<
  SceneErrorBoundaryProps,
  SceneErrorBoundaryState
> {
  state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.();

    if (process.env.NODE_ENV !== 'production') {
      console.error('Unable to render WebGL scene.', error, info);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default SceneErrorBoundary;
