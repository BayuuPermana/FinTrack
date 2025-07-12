import React from 'react';

const Button = ({ children, onClick, className, variant, size, ...props }) => {
  const baseClasses = 'font-bold py-2 px-4 rounded';
  let variantClasses = 'bg-blue-500 hover:bg-blue-700 text-white';

  if (variant === 'ghost') {
    variantClasses = 'bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white';
  }

  let sizeClasses = '';
  if (size === 'icon') {
    sizeClasses = 'p-2';
  }


  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
