// filepath: c:\Users\simon\OneDrive\Escritorio\labLoan\lab-loan-system\front\src\components\feedback\StarRating.tsx
import { useState } from 'react';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface StarRatingProps {
  initialRating?: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  readOnly?: boolean;
  onRatingChange?: (rating: number) => void;
  name?: string;
}

export default function StarRating({
  initialRating = 0,
  maxRating = 5,
  size = 'md',
  label,
  readOnly = false,
  onRatingChange,
  name
}: StarRatingProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  
  const handleClick = (selectedRating: number) => {
    if (readOnly) return;
    setRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  // Definir tamaños de estrellas
  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };
  
  // Colores para las estrellas
  const starColor = 'text-yellow-400';
  const starSizeClass = starSizes[size];

  return (
    <div>
      {label && <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>}
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = (hoverRating || rating) >= starValue;

          return (
            <button 
              key={index}
              type="button"
              disabled={readOnly}
              className={`${readOnly ? 'cursor-default' : 'cursor-pointer'} p-0.5 focus:outline-none`}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => !readOnly && setHoverRating(starValue)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
              aria-label={`Rate ${starValue} of ${maxRating}`}
            >
              {isFilled ? (
                <StarSolid className={`${starSizeClass} ${starColor}`} />
              ) : (
                <StarOutline className={`${starSizeClass} ${starColor}`} />
              )}
            </button>
          );
        })}
        
        {name && (
          <input 
            type="hidden" 
            name={name} 
            value={rating} 
          />
        )}
        
        {!readOnly && (
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            {rating > 0 ? `${rating} de ${maxRating}` : ''}
          </span>
        )}
      </div>
    </div>
  );
}