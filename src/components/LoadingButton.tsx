interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function LoadingButton({
  loading,
  children,
  ...rest
}: Props) {
  return (
    <button {...rest} disabled={loading || rest.disabled}>
      {loading ? "Processing..." : children}
    </button>
  );
}
