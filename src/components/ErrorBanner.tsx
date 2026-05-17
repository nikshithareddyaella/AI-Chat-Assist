import { AlertIcon, CloseIcon } from "@/components/icons";

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200 backdrop-blur-sm"
    >
      <AlertIcon className="mt-0.5 shrink-0 text-red-400" />
      <p className="flex-1 leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-red-300 transition hover:bg-red-500/20 hover:text-red-100"
        aria-label="Dismiss error"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
