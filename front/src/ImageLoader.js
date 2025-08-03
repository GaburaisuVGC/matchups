import React, { useState } from 'react';

const ImageLoader = ({ 
  src, 
  alt, 
  className = "", 
  style = {},
  showSkeleton = true,
  skeletonClassName = ""
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const Skeleton = () => (
    <div 
      className={`skeleton-loader ${skeletonClassName}`}
      style={{
        ...style,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '0.75rem'
      }}
    >
      <i className="fas fa-image"></i>
    </div>
  );

  return (
    <>
      {loading && showSkeleton && <Skeleton />}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            ...style,
            display: loading ? 'none' : 'block'
          }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        
        .dark-mode .skeleton-loader {
          background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%) !important;
          color: #666 !important;
        }
      `}</style>
    </>
  );
};

export default ImageLoader;