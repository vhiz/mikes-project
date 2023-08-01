import React from 'react';

const ImageGenerator = ({ numImages }) => {
 
  const imageUrl = '/star.png';

 
  const imageElements = [];

  for (let i = 0; i < numImages; i++) {
    imageElements.push(<img style={{width:"20px"}} key={i} src={imageUrl} alt={`Image ${i + 1}`} />);
  }

  return <div>{imageElements}</div>;
};

export default ImageGenerator;
