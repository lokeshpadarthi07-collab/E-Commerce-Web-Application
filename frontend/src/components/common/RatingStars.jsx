import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 4.5, count = 0, size = 'sm' }) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= Math.floor(rating)
                ? 'fill-amber-400 text-amber-400'
                : star - 0.5 <= rating
                ? 'fill-amber-200 text-amber-400'
                : 'fill-slate-100 text-slate-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-700 ml-1">
        {rating?.toFixed(1)}
      </span>
      {count > 0 && (
        <span className="text-xs text-slate-400">
          ({count})
        </span>
      )}
    </div>
  );
};
