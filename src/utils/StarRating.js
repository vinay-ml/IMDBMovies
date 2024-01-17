import React, { useState } from "react";
import Star from "./Star";
const containerStyles = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const starContainerStyle = {
  display: "flex",
  alignItems: "center",
};

const StarRating = ({
  maxRating = 5,
  color = "#fcc419",
  size = 44,
  defaultRating = 0,
  onSetRating,
}) => {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);

  const textStyle = {
    lineHeight: "1",
    margin: "0",
    color,
    fontSize: `${size / 1.5}px`,
  };

  const handleRaing = (rating) => {
    setRating(rating);
    onSetRating(rating);
  };

  return (
    <div style={containerStyles}>
      <div style={starContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onRate={() => handleRaing(i + 1)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            color={color}
            size={size}
          />
        ))}
      </div>
      <p style={textStyle}>{tempRating || rating || defaultRating}</p>
    </div>
  );
};

export default StarRating;
