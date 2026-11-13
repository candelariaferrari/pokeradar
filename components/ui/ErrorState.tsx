import Icon from "@/components/ui/Icon";

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({ title, message, onRetry, className = "" }: ErrorStateProps) {
  return (
    <div role="alert" className={`flex flex-col items-start gap-3 rounded-md border border-line bg-elevated p-4 ${className}`}>
      <strong className="flex items-center gap-2 font-semibold text-danger">
        <Icon name="alert" />
        {title}
      </strong>
      <p className="text-ink-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="h-11 rounded-full border border-line bg-surface px-5 text-sm font-medium hover:border-line-strong"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}