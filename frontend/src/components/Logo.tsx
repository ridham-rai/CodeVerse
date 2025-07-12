import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 'text-xl',
    md: 'text-2xl', 
    lg: 'text-4xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${iconSizes[size]} bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-bold`}>
        {'</>'}
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className={`${sizeClasses[size]} font-bold`}>
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Code
          </span>
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Verse
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
