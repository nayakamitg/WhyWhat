import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../index.css"




const backgrounds = {
  Animated: [
    "AnimBg1", "AnimBg2", "AnimBg3", "AnimBg4", "AnimBg5", "AnimBg6", "AnimBg7", "AnimBg8", "AnimBg9", "AnimBg10",
    "AnimBg11", "AnimBg12", "AnimBg13", "AnimBg14", "AnimBg15", "AnimBg16", "AnimBg17", "AnimBg18", "AnimBg19", "AnimBg20",
    "AnimBg21", "AnimBg22", "AnimBg23", "AnimBg24", "AnimBg25", "AnimBg26", "AnimBg27", "AnimBg28", "AnimBg29", "AnimBg30",
    "AnimBg31", "AnimBg32", "AnimBg33", "AnimBg34", "AnimBg35", "AnimBg36", "AnimBg37", "AnimBg38", "AnimBg39", "AnimBg40",
    "AnimBg41", "AnimBg42",
  ],
  Pattern: [
    "PaternBg1", "PaternBg2", "PaternBg3", "PaternBg4", "PaternBg5", "PaternBg6", "PaternBg7", "PaternBg8", "PaternBg9", "PaternBg10",
    "PaternBg11", "PaternBg12", "PaternBg13", "PaternBg14", "PaternBg15", "PaternBg16", "PaternBg17", "PaternBg18", "PaternBg19", "PaternBg20",
    "PaternBg21", "PaternBg22", "PaternBg23", "PaternBg24", "PaternBg25", "PaternBg26", "PaternBg27", "PaternBg28", "PaternBg29", "PaternBg30",
    "PaternBg31", "PaternBg32", "PaternBg33", "PaternBg34", "PaternBg35", "PaternBg36", "PaternBg37", "PaternBg38", "PaternBg39", "PaternBg40",
  ],
  Gradient: [
    "gradient-22", "gradient-23", "gradient-24", "gradient-25", "gradient-26", "gradient-27", "gradient-28", "gradient-29", "gradient-30", "gradient-31",
    "gradient-32", "gradient-33", "gradient-34", "gradient-35", "gradient-36", "gradient-37", "gradient-38", "gradient-39", "gradient-40", "gradient-41",
    "gradient-42",
  ],
};

const colors = [
  "ChatTheme1", "ChatTheme2", "ChatTheme3", "ChatTheme4", "ChatTheme5",
  "ChatTheme6", "ChatTheme7", "ChatTheme8", "ChatWhatsappTheme", "ChatDefaultTheme"
];

export default function BackgroundColorPicker() {
  const [selectedBg, setSelectedBg] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Backgrounds Section */}
        <div className="mb-5">
          <h2 className="bgc-section-title">Backgrounds</h2>
          
          {Object.entries(backgrounds).map(([category, items]) => (
            <div key={category} className="mb-4">
              <h3 className="bgc-category-title">{category}</h3>
              <div className="bgc-scroll-container">
                <div className="d-inline-flex justify-content-center flex-wrap gap-3">
                  {items.map((bg) => (
                    <div key={bg} className="bgc-box-wrapper">
                      <button
                        onClick={() => setSelectedBg(bg)}
                        className={`bgc-theme-box ${bg.includes("Anim")?"anim":"pattern"} ${bg} ${selectedBg === bg ? 'bgc-selected' : ''}`}
                        title={bg}
                      >
                        <span className="bgc-box-label">{bg}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Colors Section */}
        <div className="mb-5">
          <h2 className="bgc-section-title">Colors</h2>
          <div className="bgc-scroll-container">
            <div className="d-inline-flex justify-content-center flex-wrap gap-3">
              {colors.map((color) => (
                <div key={color} className="bgc-box-wrapper">
                  <button
                    onClick={() => setSelectedColor(color)}
                    className={`bgc-theme-box ${color} ${selectedColor === color ? 'bgc-selected' : ''}`}
                    title={color}
                  >
                    <span className="bgc-box-label">{color}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selection Display */}
        {(selectedBg || selectedColor) && (
          <div className="bgc-selection-card">
            <h3 className="h5 mb-3">Current Selection:</h3>
            <div>
              {selectedBg && (
                <p className="mb-2">
                  <span className="bgc-selection-label">Background:</span> {selectedBg}
                </p>
              )}
              {selectedColor && (
                <p className="mb-0">
                  <span className="bgc-selection-label">Color:</span> {selectedColor}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
