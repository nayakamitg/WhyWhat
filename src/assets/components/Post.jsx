import { X } from 'lucide-react';
import React from 'react'

const Post = () => {
  return (
    <>
    

        {/* <textarea name="post" id="" className='postInput'></textarea> */}

        <ReelEditor/>
     
  
     </>
  )
}

export default Post



import { useState, useRef, useCallback } from 'react';

const ReelEditor = () => {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [textElements, setTextElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activePanel, setActivePanel] = useState(null); // 'background', 'text', 'effects'
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Predefined gradient backgrounds
  const gradientBackgrounds = [
    'linear-gradient(45deg, #ff6b6b, #feca57)',
    'linear-gradient(45deg, #48cae4, #023047)',
    'linear-gradient(45deg, #f093fb, #f5576c)',
    'linear-gradient(45deg, #4facfe, #00f2fe)',
    'linear-gradient(45deg, #43e97b, #38f9d7)',
    'linear-gradient(45deg, #fa709a, #fee140)',
  ];

  const fontFamilies = [
    'Arial, sans-serif',
    'Georgia, serif',
    'Impact, sans-serif',
    'Courier New, monospace',
    'Helvetica, sans-serif',
    'Times New Roman, serif'
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    const newElement = {
      id: Date.now(),
      text: 'Your text here',
      x: 50,
      y: 400,
      fontSize: 32,
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      rotation: 0,
      maxWidth: 300
    };
    setTextElements([...textElements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateTextElement = (id, updates) => {
    setTextElements(elements =>
      elements.map(el => el.id === id ? { ...el, ...updates } : el)
    );
  };

  const deleteTextElement = (id) => {
    setTextElements(elements => elements.filter(el => el.id !== id));
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const handleMouseDown = useCallback((e, elementId) => {
    e.preventDefault();
    const element = textElements.find(el => el.id === elementId);
    if (element) {
      const rect = canvasRef.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - element.x;
      const offsetY = e.clientY - rect.top - element.y;
      
      setSelectedElement(elementId);
      setIsDragging(true);
      setDragOffset({ x: offsetX, y: offsetY });
    }
  }, [textElements]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && selectedElement && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;
      const newX = Math.max(0, Math.min(canvasWidth - 100, e.clientX - rect.left - dragOffset.x));
      const newY = Math.max(0, Math.min(canvasHeight - 50, e.clientY - rect.top - dragOffset.y));
      
      updateTextElement(selectedElement, { x: newX, y: newY });
    }
  }, [isDragging, selectedElement, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const selectedElementData = textElements.find(el => el.id === selectedElement);

  const bottomIcons = [
    { id: 'background', icon: '🖼️', name: 'Background' },
    { id: 'text', icon: '📝', name: 'Text' },
    { id: 'effects', icon: '✨', name: 'Effects' },
    { id: 'stickers', icon: '😀', name: 'Stickers' },
    { id: 'music', icon: '🎵', name: 'Music' },
  ];

  const handleIconClick = (iconId) => {
    if (activePanel === iconId) {
      setActivePanel(null); // Close if already open
    } else {
      setActivePanel(iconId); // Open the selected panel
    }
  };

  const renderEditorPanel = () => {
    if (!activePanel) return null;

    switch (activePanel) {
      case 'background':
        return (
          <div className="editor-panel">
            <h4 className="panel-title">Background</h4><span className='position-absolute Xbutton'><X size={30} onClick={()=>setActivePanel(false)}/></span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn btn-primary w-100 mb-3"
            >
              📷 Upload Image
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="d-none"
            />

            <div className="row g-2 mb-3">
              {gradientBackgrounds.map((gradient, index) => (
                <div key={index} className="col-4">
                  <button
                    className="gradient-btn"
                    style={{ background: gradient }}
                    onClick={() => setBackgroundImage(gradient)}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setBackgroundImage(null)}
              className="btn btn-secondary w-100"
            >
              🔄 Clear Background
            </button>
          </div>
        );

      case 'text':
        return (
          <div className="editor-panel">
            <h4 className="panel-title">Text</h4>
            <button
              onClick={addTextElement}
              className="btn btn-success w-100 mb-4"
            >
              ➕ Add Text
            </button>

            {selectedElementData && (
              <div>
                <h5 className="h6 text-muted mb-3">Edit Selected Text</h5>
                
                <div className="mb-3">
                  <label className="form-label">Text Content</label>
                  <textarea
                    value={selectedElementData.text}
                    onChange={(e) => updateTextElement(selectedElement, { text: e.target.value })}
                    className="form-control"
                    rows="3"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Font Size: {selectedElementData.fontSize}px</label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={selectedElementData.fontSize}
                    onChange={(e) => updateTextElement(selectedElement, { fontSize: parseInt(e.target.value) })}
                    className="form-range"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Font Family</label>
                  <select
                    value={selectedElementData.fontFamily}
                    onChange={(e) => updateTextElement(selectedElement, { fontFamily: e.target.value })}
                    className="form-select"
                  >
                    {fontFamilies.map(font => (
                      <option key={font} value={font}>{font.split(',')[0]}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Color</label>
                  <input
                    type="color"
                    value={selectedElementData.color}
                    onChange={(e) => updateTextElement(selectedElement, { color: e.target.value })}
                    className="form-control form-control-color w-100"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Font Weight</label>
                  <select
                    value={selectedElementData.fontWeight}
                    onChange={(e) => updateTextElement(selectedElement, { fontWeight: e.target.value })}
                    className="form-select"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                    <option value="lighter">Light</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Rotation: {selectedElementData.rotation}°</label>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={selectedElementData.rotation}
                    onChange={(e) => updateTextElement(selectedElement, { rotation: parseInt(e.target.value) })}
                    className="form-range"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Max Width: {selectedElementData.maxWidth}px</label>
                  <input
                    type="range"
                    min="100"
                    max="350"
                    value={selectedElementData.maxWidth}
                    onChange={(e) => updateTextElement(selectedElement, { maxWidth: parseInt(e.target.value) })}
                    className="form-range"
                  />
                </div>

                <button
                  onClick={() => deleteTextElement(selectedElement)}
                  className="btn btn-danger w-100"
                >
                  🗑️ Delete Text
                </button>
              </div>
            )}
          </div>
        );

      case 'effects':
        return (
          <div className="editor-panel">
            <h4 className="panel-title">Effects</h4>
            <p className="text-muted">Effects coming soon...</p>
          </div>
        );

      case 'stickers':
        return (
          <div className="editor-panel">
            <h4 className="panel-title">Stickers</h4>
            <p className="text-muted">Stickers coming soon...</p>
          </div>
        );

      case 'music':
        return (
          <div className="editor-panel">
            <h4 className="panel-title">Music</h4>
            <p className="text-muted">Music coming soon...</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      <style>{`
        .reel-editor-container {
          height: 100vh;
          background-color: #ffffffff;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          width:100vw;
        }

        .canvas-area {
          flex: 1;
          display: flex;
          justify-content: center;
          padding: 20px;
          margin-top:60px;
          position: relative;
        }

        .reel-canvas {
          position: relative;
            width: 500px;
          background-color: #ffffffff;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          background-size: cover;
          background-position: center;
          aspact-ratio:16/9;
        }

        .text-element {
          position: absolute;
          cursor: move;
          user-select: none;
          word-wrap: break-word;
          white-space: pre-wrap;
          max-width: 320px;
          line-height: 1.2;
          padding: 5px;
        }

        .text-element.selected {
          outline: 2px solid #007bff;
          outline-offset: 2px;
        }

        .bottom-toolbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 15px 0;
          z-index: 1000;
        }

        .bottom-icons {
          display: flex;
          justify-content: space-around;
          align-items: center;
          max-width: 600px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .icon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
          min-width: 70px;
        }

        .icon-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .icon-item.active {
          background: rgba(0, 123, 255, 0.3);
          color: #007bff;
        }

        .icon-emoji {
          font-size: 24px;
          margin-bottom: 4px;
        }

        .icon-name {
          font-size: 11px;
          font-weight: 500;
          text-align: center;
        }

        .editor-panel {
          position: fixed;
          bottom: 80px;
          left: 0;
          right: 0;
          background: white;
          border-radius: 20px 20px 0 0;
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
          box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);
          z-index: 999;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .panel-title {
          color: #333;
          margin-bottom: 20px;
          text-align: center;
          border-bottom: 2px solid #007bff;
          padding-bottom: 10px;
        }

        .gradient-btn {
          width: 100%;
          height: 40px;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.3s;
        }

        .gradient-btn:hover {
          border-color: #007bff;
        }

        .form-range {
          margin: 10px 0;
        }

        @media (max-width: 768px) {
          .reel-canvas {
            max-width: 280px;
            height: 400px;
          }

          .text-element {
            max-width: 250px;
          }

          .bottom-icons {
            padding: 0 10px;
          }

          .icon-item {
            min-width: 60px;
            padding: 6px 8px;
          }

          .icon-emoji {
            font-size: 20px;
          }

          .icon-name {
            font-size: 10px;
          }
        }

        @media (max-width: 576px) {
          .reel-canvas {
            max-width: 250px;
            height: 350px;
          }

          .text-element {
            max-width: 220px;
          }

          .icon-item {
            min-width: 50px;
            padding: 4px 6px;
          }

          .icon-emoji {
            font-size: 18px;
          }

          .icon-name {
            font-size: 9px;
          }
        }
      `}</style>

      <div className="reel-editor-container">
        {/* Canvas Area */}
        <div className="canvas-area">
          <div
            ref={canvasRef}
            className="reel-canvas"
            style={{
              backgroundImage: backgroundImage && !backgroundImage.includes('gradient') 
                ? `url(${backgroundImage})` 
                : backgroundImage || 'none',
              background: backgroundImage && backgroundImage.includes('gradient') 
                ? backgroundImage 
                : undefined
            }}
          >
            {/* Text Elements */}
            {textElements.map(element => (
              <div
                key={element.id}
                className={`text-element ${selectedElement === element.id ? 'selected' : ''}`}
                style={{
                  left: element.x,
                  top: element.y,
                  color: element.color,
                  fontSize: element.fontSize + 'px',
                  fontFamily: element.fontFamily,
                  fontWeight: element.fontWeight,
                  textShadow: element.textShadow,
                  transform: `rotate(${element.rotation}deg)`,
                  transformOrigin: 'top left',
                  maxWidth: element.maxWidth + 'px'
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
                onClick={() => setSelectedElement(element.id)}
              >
                {element.text}
              </div>
            ))}
          </div>
        </div>

        {/* Editor Panel */}
        {renderEditorPanel()}

        {/* Bottom Toolbar */}
        <div className="bottom-toolbar">
          <div className="bottom-icons">
            {bottomIcons.map(icon => (
              <button
                key={icon.id}
                className={`icon-item ${activePanel === icon.id ? 'active' : ''}`}
                onClick={() => handleIconClick(icon.id)}
              >
                <div className="icon-emoji">{icon.icon}</div>
                <div className="icon-name">{icon.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
