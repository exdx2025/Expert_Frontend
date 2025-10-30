import React from 'react';
import './GalleryTittle.css';

// Organize all imports in one place
const galleryImages = [
  { id: 1, src: require('./img19.jpg'), title: 'MRI Diagnostics' },
  { id: 2, src: require('./img12.jpg'), title: 'CT-SCAN' },
  { id: 3, src: require('./img20.jpg'), title: 'X-RAY' },
  { id: 4, src: require('./img21.jpg'), title: 'Ultrasonography' },
  { id: 5, src: require('./img22.jpg'), title: 'Treadmill Testing' },
  { id: 6, src: require('./img17.jpeg'), title: 'MRI-Mammography' },
  { id: 7, src: require('./img23.jpg'), title: 'Mammography' },
  { id: 8, src: require('./img24.jpg'), title: 'Electrocardiogram(ECG)' },
  // { id: 9, src: require('./img25.jpg'), title: 'Bone Density Test' },
  { id: 10, src: require('./img26.jpg'), title: 'Electroencephalogram' },
  { id: 11, src: require('./img27.jpg'), title: 'Pulmonary Function' },
  // { id: 12, src: require('./img14.jpg'), title: 'Physical Therapy' },
];

const GalleryTittle = () => {
  return (
    <section className="expert-gallery">
      {/* Banner Section */}
      <div className="gallery-banner">
        <div className="banner-content">
          <h1 className="gallery-heading">Expert Gallery</h1>
          {/* <p className="gallery-subtitle">Meet Our Specialist Team</p> */}
        </div>
      </div>

      {/* Image Grid Section */}
      <div className="image-grid">
        {galleryImages.map((image) => (
          <div key={image.id} className="image-card">
            <img 
              src={image.src} 
              alt={image.title} 
              className="gallery-image"
              loading="lazy" // For better performance
            />
            <div className="image-overlay">
              <h3 className="image-title">{image.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GalleryTittle;