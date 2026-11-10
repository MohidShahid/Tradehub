import Logo from "../assets/logo.png";

const LoadingScreen = ({
  message = "Preparing your marketplace...",
  fullScreen = true,
}) => {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xs"
    : "flex flex-col items-center justify-center py-12";

  return (
    <div className={containerClasses}>
      {/* Background ambient glow matching primary light palette */}
      <div className="absolute h-72 w-72 rounded-full bg-(--color-primary-light) opacity-60 blur-3xl pointer-events-none animate-pulse" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Animated Brand Spinner with Central Logo */}
        <div className="relative flex items-center justify-center">
          {/* Subtle outer pulsing ping ring */}
          <div className="absolute h-24 w-24 rounded-full border-2 border-(--color-primary-light) animate-ping opacity-30" />

          {/* Smooth spinning dual-tone brand ring: Forest Green + Accent Orange */}
          <div className="h-20 w-20 rounded-full border-[3.5px] border-(--color-primary-light) border-t-(--color-primary) border-r-(--color-accent) animate-spin [animation-duration:1s]" />

          {/* Centered TradeHub Logo with subtle breathing pulse */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={Logo}
              alt="TradeHub"
              className="h-10 w-10 object-contain drop-shadow-xs transition-transform hover:scale-105"
            />
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="flex items-center text-2xl font-bold tracking-tight">
            <span className="text-(--color-primary)">Trade</span>
            <span className="text-(--color-accent)">Hub</span>
          </div>

          {/* Status Message with Brand-Colored Bouncing Dots */}
          <div className="flex items-center gap-2 text-xs font-medium text-(--color-text-secondary)">
            <span>{message}</span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) animate-bounce [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-accent) animate-bounce [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-primary) animate-bounce" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

