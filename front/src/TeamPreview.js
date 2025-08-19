import React from 'react';
import ImageLoader from './ImageLoader';

const TeamPreview = ({ pokemonImages, loadingImages, teamLength, data }) => {
  if (!data || !data.team || data.team.length === 0) return null;

  return (
    <div className="row g-2 justify-content-center">
      {data.team.map((pokemon, index) => (
        <div key={index} className="col-2">
          <div className="text-center">
            {data.paste ? (
              <ImageLoader
                src={pokemonImages[index]}
                alt={pokemon.species}
                className="img-thumbnail"
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'contain',
                  background: 'transparent',
                }}
                showSkeleton={true}
              />
            ) : (
              <div 
                className="img-thumbnail d-flex align-items-center justify-content-center" 
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'transparent',
                  border: '1px solid #dee2e6'
                }}
              >
                <i className="fas fa-circle" style={{ fontSize: '40px', color: '#ccc' }}></i>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamPreview;