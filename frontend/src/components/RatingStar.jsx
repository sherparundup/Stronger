import React, { useState, useEffect } from "react";

const StarRating = ({ rating: initialRating = 0, onRate, readOnly = false }) => {
  const [rating, setRating] = useState(initialRating);

  // Update local rating when the prop changes
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  // Only update rating if not read-only
  const handleRatingChange = (newRating) => {
    if (!readOnly && onRate) {
      setRating(newRating);
      onRate(newRating);
    }
  };

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRatingChange(star)}
          disabled={readOnly} // Disable button if readOnly is true
          className={`text-4xl ${star <= rating ? "text-yellow-500" : "text-gray-300"} ${
            readOnly ? "cursor-default" : "cursor-pointer"
          }`}
        >
          &#9733;
        </button>
      ))}
      <div className="ml-2 mt-2 text-4xl font-semibold">{rating} / 5</div>
    </div>
  );
};

export default StarRating;
