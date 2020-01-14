import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ boxes, imageUrl }) => {

  return (
    //cek when data is empty
    imageUrl === '' ? <div></div> :
      <div className='center ma'>
        <div className='absolute mt2'>
          <img id='inputImage' alt='model' src={imageUrl} width='500px' />
          {
            // loop through the box coordinat array
            boxes.map((box, index) => {
              const { leftCol, topRow, rightCol, bottomRow } = boxes[index];
              return (
                <div
                  key={index}
                  className='bounding-box'
                  style={{ top: topRow, left: leftCol, bottom: bottomRow, right: rightCol }}
                />
              )
            })
          }
        </div>
      </div>
  )

};

export default FaceRecognition;