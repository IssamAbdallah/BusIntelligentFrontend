import { Bus } from 'lucide-react';

export default function Logo({ size = 'default', variant = 'primary' }) {
  // Options de taille
  const sizeClasses = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-3xl'
  };
  
  // Options de variante de couleur
  const variantClasses = {
    primary: 'text-white',
    admin: 'text-blue-600',
    parent: 'text-green-600',
    dark: 'text-gray-800'
  };
  
  return (
    <div className={`font-bold flex items-center ${sizeClasses[size]} ${variantClasses[variant]}`}>
      <Bus className="mr-2" size={size === 'small' ? 20 : size === 'large' ? 32 : 24} strokeWidth={2.5} />
      <span>Smart<span className="font-extrabold">Bus</span></span>
    </div>
  );
}