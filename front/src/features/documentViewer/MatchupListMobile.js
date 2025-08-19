import React, { useState } from 'react';
import MatchupForm from '../documentEditor/MatchupForm';
import AddMatchupForm from '../documentEditor/AddMatchupForm';

const MatchupListMobile = ({ data, setData, setSelectedMatchup }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <>
      <AddMatchupForm data={data} setData={setData} />
      <div className="accordion" id="matchupAccordionMobile">
        {data.matchups.map((matchup, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div key={index} className="accordion-item-modern">
              <h2 className="accordion-header-modern mb-0" onClick={() => toggleExpand(index)}>
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span className="fw-medium">{matchup.title}</span>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-primary me-3">{matchup.gameplans.length} gameplan{matchup.gameplans.length !== 1 ? 's' : ''}</span>
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                  </div>
                </div>
              </h2>
              {isExpanded && (
                <div className="accordion-body-modern">
                  <MatchupForm
                    data={data}
                    setData={setData}
                    selectedMatchup={index}
                    setSelectedMatchup={setSelectedMatchup}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MatchupListMobile;
