import React from 'react';
import './AnalyticCountTab.css';

const AnalyticCountTab = ({
  color = 'orange',
  count = 1,
  primaryText = 'Number',
  secondaryText = 'Counts',
}) => {
  return (
    <div className="count--container" style={{ color: `${color}` }}>
      <div className="count--container--content">
        <div className="flex count--container--content--formatter">
          <span className="count--container--content--number">{count}</span>
          <p>{primaryText}</p>
        </div>
        <p>{secondaryText}</p>
      </div>
    </div>
  );
};

export default AnalyticCountTab;
