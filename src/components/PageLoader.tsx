export function PageLoader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
      <div className="loader-container">
        <div className="loader-holder">
          <div className="loader-box"></div>
        </div>
        <div className="loader-holder">
          <div className="loader-box"></div>
        </div>
        <div className="loader-holder">
          <div className="loader-box"></div>
        </div>
      </div>
    </div>
  );
}
