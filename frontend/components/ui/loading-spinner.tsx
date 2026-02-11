type LoadingSpinnerProps = {
  size?: "sm" | "md";
};

export function LoadingSpinner({ size = "sm" }: LoadingSpinnerProps) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${
        size === "sm" ? "h-4 w-4" : "h-5 w-5"
      }`}
      aria-hidden="true"
    />
  );
}
