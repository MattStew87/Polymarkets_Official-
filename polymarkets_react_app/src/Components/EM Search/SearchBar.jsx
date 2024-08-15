import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function SearchBar({ onSelectEvent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://3.141.7.141:5000/api/searchEvents');
        setEvents(response.data);

        if (response.data.length > 0) {
          onSelectEvent(response.data[0]);
          setSearchTerm(response.data[0].title);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message); 
      }
    }; 
    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      const filteredSuggestions = events
        .filter(event => event.title.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (event) => {
    setSearchTerm(event.title);
    setShowSuggestions(false);
    onSelectEvent(event);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex-none position-relative">
      <div className="input-group input-group-sm input-group-inline w-rem-64 rounded-pill">
        <span className="input-group-text rounded-start-pill">
          <i className="bi bi-search me-2" />
        </span>
        <input
          type="search"
          className="form-control ps-0 rounded-end-pill"
          placeholder="Search"
          aria-label="Search"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      {showSuggestions && (
        <ul 
          ref={suggestionsRef} 
          className="list-group position-absolute w-70 mt-1 shadow-sm"
          style={{ backgroundColor: '#fff', zIndex: 1000}}
        >
          {suggestions.map((event, index) => (
            <li 
              key={index} 
              className="list-group-item list-group-item-action"
              onClick={() => handleSuggestionClick(event)}
            >
              {event.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
