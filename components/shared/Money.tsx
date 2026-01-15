interface MoneyProps {
  amount: number;
  className?: string;
}

export function Money({ amount, className = '' }: MoneyProps) {
  const formatted = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <span className={`money-display ${className}`}>
      {formatted}
    </span>
  );
}
