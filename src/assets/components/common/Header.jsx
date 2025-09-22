
import { ArrowLeft, Bell, Compass, Languages, Mic, Moon, Search, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Container, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router'

const Header = ({mode,setMode}) => {

    
    const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearch,setIsSearch] = useState(false)
 const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

   useEffect(() => {
    document.body.className =
      mode === "light" ? "bg-light text-dark" : "bg-dark text-light";
  }, [mode]);

  useEffect(
    ()=>{

  let newMode= localStorage.getItem("mode")
  if(newMode){
    setMode(newMode)
  }
    },[])

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBack = () => {
    console.log('Going back');
  };

  const handleMode=()=>{
    if(mode=="dark")
    {
      localStorage.setItem("mode","light")
    setMode("light")
  }
  else{
    localStorage.setItem("mode","dark")
    setMode("dark")
  }
}

  return (
    <>


      <nav className={`container-fluid border-bottom p-0 border-2 d-flex justify-content-between align-item-center mainHeader ${ mode === "light" ? "bg-light text-dark" : "bg-dark text-light"}`}>

  {isSearch? <header className="youtube-header">
        <div className="header-container d-flex align-items-center">
          {/* Back Button */}
          <button 
            className="back-btn1" 
            onClick={handleBack}
            title="Go back"
          >
            <ArrowLeft size={24} onClick={()=>setIsSearch(false)} />
          </button>

          {/* Search Container */}
          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
                <Search size={20} className="search-icon" />
              </div>
              
              {/* Search Suggestions */}
              {isSearchFocused && (
                <div className="search-suggestions">
                  <button 
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery('how to cook pasta');
                      setIsSearchFocused(false);
                    }}
                  >
                    <Search size={16} className="suggestion-icon" />
                    <span>how to cook pasta</span>
                  </button>
                  <button 
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery('youtube shorts tutorial');
                      setIsSearchFocused(false);
                    }}
                  >
                    <Search size={16} className="suggestion-icon" />
                    <span>youtube shorts tutorial</span>
                  </button>
                  <button 
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery('travel vlog ideas');
                      setIsSearchFocused(false);
                    }}
                  >
                    <Search size={16} className="suggestion-icon" />
                    <span>travel vlog ideas</span>
                  </button>
                  <button 
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery('react javascript tutorial');
                      setIsSearchFocused(false);
                    }}
                  >

                    <Search size={16} className="suggestion-icon" />
                    <span>react javascript tutorial</span>
                  </button>
                  <button 
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery('cooking recipes easy');
                      setIsSearchFocused(false);
                    }}
                  >
                    <Search size={16} className="suggestion-icon" />
                    <span>cooking recipes easy</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Voice Search Button */}
          <button 
            className="mic-btn" 
            title="Search with your voice"
            onClick={() => console.log('Voice search activated')}
          >
            <Mic size={20} />
          </button>
        </div>
      </header>:

     <><Link to="/">
      <img className='img my-3 mx-4' loading='lazy' width={"90px"} src='/4.png' />
      </Link>
        <div className="pt-2 mx-3 d-flex">
          <Search className='mx-2 mt-2' size={22} onClick={()=>setIsSearch(true)}/>
            <div className="notification">
          <Bell className='ball mx-2 mt-2' size={22}/>
          <span className='NotificationCount'>2</span>
          </div>
    
<span>
<Dropdown>
  <Dropdown.Toggle as="button" className="border-0 bg-transparent">
   <Languages className='mx-2 mt-2' color={mode==="light"?"black":"white"} size={22}/>
  </Dropdown.Toggle>
  <Dropdown.Menu className='position-absolute language'>
    <Dropdown.Item>हिन्दी</Dropdown.Item>
    <Dropdown.Item>English</Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
</span>

<div className="mode" onClick={()=>handleMode()}>
 {mode==="dark"?<Moon style={{marginTop:"8px"}}/>:
  <Sun style={{marginTop:"8px"}}/>}
</div>


          
        </div>
        </>  
       }

      </nav>

      

     <style>{`
        .youtube-header {
          background: #f8f9fa;
          height: 56px;
          width:100vw;
        }

        .header-container {
          height: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0 16px;
        }

        
        .back-btn1 {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 50%;
          color: #606060;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
          min-width: 40px;
          height: 40px;
        }

        .back-btn1:hover {
          background: #f0f0f0;
          color: #303030;
        }

        .search-container {
          flex-grow: 1;
          max-width: 600px;
          margin: 0 16px;
          position: relative;
        }

        .search-wrapper {
          position: relative;
          width: 100%;
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          height: 40px;
          padding: 0 16px 0 48px;
          border: 1px solid #ccc;
          border-radius: 20px;
          font-size: 16px;
          background: white;
          color: #303030;
          transition: all 0.2s ease;
          outline: none;
        }

        .search-input:focus {
          border-color: #1976d2;
          box-shadow: 0 0 0 1px #1976d2;
        }

        .search-input::placeholder {
          color: #9aa0a6;
          font-size: 16px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #9aa0a6;
          z-index: 2;
          pointer-events: none;
        }


        .search-input:focus + .search-icon {
          color: #1976d2;
        }
          .show{
          z-index:1000;
          }

        .mic-btn {
          background: white;
          border: 1px solid #ccc;
          padding: 8px;
          border-radius: 50%;
          color: #606060;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          min-width: 40px;
          height: 40px;
          margin-left: 8px;
        }

        .mic-btn:hover {
          background: #f0f0f0;
          border-color: #999;
          color: #303030;
        }

        .mic-btn:active {
          background: #e8f0fe;
          border-color: #1976d2;
          color: #1976d2;
        }

        /* Search suggestions */
        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 8px 8px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 1001;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .suggestion-item {
          padding: 12px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.1s ease;
          border: none;
          width: 100%;
          text-align: left;
          background: white;
        }

        .suggestion-item:hover {
          background: #f8f9fa;
        }

        .suggestion-icon {
          margin-right: 12px;
          color: #9aa0a6;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .header-container {
            padding: 0 8px;
          }
          
          .search-container {
            margin: 0 8px;
          }
          
          .search-input {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }

        @media (max-width: 480px) {
          .search-input {
            padding-left: 40px;
          }
          
          .search-icon {
            left: 12px;
          }
        }
      `}</style>


    </>
  )
}

export default Header
