export function ChatSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-8 sm:px-6" aria-hidden="true">
      {[72, 48, 88].map((width) => (
        <div key={width} className="flex gap-4">
          <div className="h-9 w-9 shrink-0 rounded-xl skeleton-shimmer" />
          <div className="flex flex-1 flex-col gap-2 pt-1">
            <div className="h-3 w-20 rounded skeleton-shimmer" />
            <div
              className="h-4 rounded skeleton-shimmer"
              style={{ width: `${width}%`, maxWidth: "100%" }}
            />
            <div className="h-4 w-2/3 rounded skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
