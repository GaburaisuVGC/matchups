import React from 'react';
import ImageLoader from './ImageLoader';

const TeamPreview = ({ pokemonImages, loadingImages, teamLength }) => {
  const hasData = loadingImages || (pokemonImages && pokemonImages.length > 0);
  if (!hasData) return null;

  return (
    <div className="row g-2 justify-content-center">
      {loadingImages
        ? Array.from({ length: teamLength }).map((_, index) => (
            <div key={index} className="col-2">
              <div className="text-center">
                <ImageLoader
                  src=""
                  alt=""
                  className="border-0"
                  style={{ width: '80px', height: '80px' }}
                  showSkeleton={true}
                />
              </div>
            </div>
          ))
        : pokemonImages.map((src, index) => (
            <div key={index} className="col-2">
              <div className="text-center">
                <ImageLoader
                  src={src}
                  alt={`Pokémon ${index + 1}`}
                  className="img-thumbnail"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'contain',
                    background: 'transparent',
                  }}
                />
              </div>
            </div>
          ))}
    </div>
  );
};

export default TeamPreview;
