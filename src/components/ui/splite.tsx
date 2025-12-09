import { Suspense, lazy, Component, ReactNode } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SplineErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const SplineFallback = ({ className }: { className?: string }) => (
  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-accent/20 ${className || ''}`}>
    <div className="text-center space-y-4">
      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary to-accent opacity-50 animate-pulse" />
      <p className="text-muted-foreground text-sm">3D Scene</p>
    </div>
  </div>
);

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <SplineErrorBoundary fallback={<SplineFallback className={className} />}>
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
        />
      </Suspense>
    </SplineErrorBoundary>
  );
}
