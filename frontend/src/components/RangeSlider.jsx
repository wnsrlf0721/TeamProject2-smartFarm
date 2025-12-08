import React from 'react';
import './RangeSlider.css';

// 두 개의 핸들(min, max)이 있는 커스텀 슬라이더
export const RangeSlider = ({ label, min, max, step = 1, unit = '', minValue, maxValue, onChange }) => {
  
    const handleMinChange = (e) => {
      const val = Math.min(Number(e.target.value), maxValue - step);
      onChange(val, maxValue);
    };
  
    const handleMaxChange = (e) => {
      const val = Math.max(Number(e.target.value), minValue + step);
      onChange(minValue, val);
    };
  
    const getPercent = (value) => ((value - min) / (max - min)) * 100;
  
    return (
      <div className="range-slider-wrapper">
        <div className="rs-header">
          <span>{label}</span>
          <div className="rs-values">
            <span className="val-min">{minValue}{unit}</span>
            <span style={{ margin: '0 4px', color: '#666' }}>-</span>
            <span className="val-max">{maxValue}{unit}</span>
          </div>
        </div>
        <div className="rs-track-container">
          <div className="rs-track-bg"></div>
          <div 
            className="rs-track-active"
            style={{
              left: `${getPercent(minValue)}%`,
              width: `${getPercent(maxValue) - getPercent(minValue)}%`
            }}
          ></div>
          <input 
            type="range" min={min} max={max} step={step} 
            value={minValue} onChange={handleMinChange} 
            className="rs-thumb min-thumb"
          />
          <input 
            type="range" min={min} max={max} step={step} 
            value={maxValue} onChange={handleMaxChange} 
            className="rs-thumb max-thumb"
          />
        </div>
      </div>
    );
  };
  export default RangeSlider;