type LoadingSpinnerProps = {
  className?: string;
};

const LoadingSpinner = ({ className = 'h-8 w-8' }: LoadingSpinnerProps) => (
  <div className="flex justify-center items-center">
    <div
      className={`animate-spin rounded-full border-b-2 border-gray-900 ${className}`}
    ></div>
  </div>
);

export default LoadingSpinner;
