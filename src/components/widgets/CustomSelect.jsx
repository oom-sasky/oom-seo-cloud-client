import React, { useState, useEffect, useRef } from 'react';
import '../../assets/css/CustomSelect2.css';  // Add your custom styles

const CustomSelect = ({ placeholder, options, selectedItems, onSelect, onRemove, multiSelect = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef(null);

  useEffect(() => {
    // Filter options based on the search term
    setFilteredOptions(
      options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    // Close the dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (option) => {
    if (multiSelect) {
      // Multi-select behavior
      const newSelection = selectedItems.some(item => item.value === option.value)
        ? selectedItems.filter(item => item.value !== option.value) // Remove item if already selected
        : [...selectedItems, option]; // Add item if not selected
      onSelect(newSelection);
    } else {
      // Single select behavior
      onSelect([option]);  // Always return an array with one item for consistency
      setIsOpen(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div ref={containerRef} className="oom-field-container oom-custom-select-container">
    <div className="oom-custom-select" onClick={handleSelectClick}>
      <span className="oom-select-placeholder">
        {selectedItems.length > 0 ? (
          selectedItems.map((opt) => (
            <span key={opt.value} className="selected-item">
              {opt.label}
              <span
                className="remove-item"
                onClick={(e) => {
                  e.stopPropagation();  // Prevent dropdown from toggling
                  onRemove(opt);        // Call the remove function
                }}
              >
                &times;
              </span>
            </span>
          ))
        ) : (
          placeholder
        )}
      </span>
    </div>
    {isOpen && (
      <div className="oom-select-dropdown">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="oom-search-input"
        />
        <div className="oom-dropdown-options">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`oom-dropdown-option ${selectedItems.some(item => item.value === option.value) ? 'selected' : ''}`}
                onClick={() => toggleOption(option)}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="oom-no-options">No options found</div>
          )}
        </div>
      </div>
    )}
  </div>
  );
};

export default CustomSelect;
