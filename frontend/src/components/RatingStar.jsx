import React, { useState } from "react";

const StarRating = ({ onRate }) => {
  const [rating, setRating] = useState(0);
  
  // Function to handle rating change
  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (onRate) {
      onRate(newRating); // Pass the rating to the parent component if onRate prop exists
    }
  };

  return (
    <div className="flex ">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => handleRatingChange(star)}
          className={`text-4xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
        >
          &#9733; {/* This is the star symbol */}
        </button>
      ))}
      <div className="ml-2 mt-2 text-4xl font-semibold">{rating} / 5</div>
    </div>
  );
};

export default StarRating;
