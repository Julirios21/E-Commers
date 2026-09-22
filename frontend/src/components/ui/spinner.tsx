import { Loader2 } from 'lucide-react';

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600`} />
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
    </div>
  );
}
