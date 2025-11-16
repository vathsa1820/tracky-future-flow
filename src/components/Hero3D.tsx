import { SplineScene } from "./SplineScene";

export const Hero3D = () => {
  return (
    <div className="relative h-[500px] w-full">
      <div className="absolute inset-0">
        <SplineScene 
          scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
          className="w-full h-full"
        />
      </div>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Welcome to Tracky
          </h1>
          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
            Your futuristic productivity companion designed for engineering excellence
          </p>
        </div>
      </div>
    </div>
  );
};
