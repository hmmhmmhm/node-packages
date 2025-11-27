export function Crosshair() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-100">
      <div className="relative">
        <div className="absolute w-5 h-0.5 bg-white mix-blend-difference top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-0.5 h-5 bg-white mix-blend-difference top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  )
}
