import React, { useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GeminiIcon from '../elements/GeminiIcon';
import DescriptionItemComponent from './DescriptionItemComponent';

const DescriptionItemsComponent = ({ title, lengthType, reports, loading, generating, generatedContent, handleGenerateClick, isMissingType }) => {
  const capitalizeFirst = (text) => {
    if (!text) return text; // Check if the string is empty or undefined
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }

  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCheckboxChange = (itemId, isChecked) => {
    setSelectedItems(prevSelected => {
      // Ensure `prevSelected` is always an array.
      const newSelectedItems = Array.isArray(prevSelected) ? prevSelected : [];

      if (isChecked) {
        // Add the itemId to the array if it is checked
        return [...newSelectedItems, itemId];
      } else {
        // Remove the itemId from the array if it is unchecked
        return newSelectedItems.filter(id => id !== itemId);
      }
    });
  };

  const handleSelectAllChange = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      const allIds = reports.map((report) => report._id);
      setSelectedItems(allIds);
    } else {
      setSelectedItems([]);
    }
  };

  const handleBulkGenerateClick = async () => {
    if (selectedItems.length === 0) return;

    setIsGenerating(true);
    try {
      for (const report of selectedItems) {
        if (report) {
          await handleGenerateClick(report, 'meta_description', report.pageUrl, report.pageContent);
        }
      }
    } catch (error) {
      console.error("Error generating descriptions:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <div className='oom-report-details_item-table_data__item'>
      <div className="oom-report-details_item-table_data-details">
        <div className="oom-report-details_item-table_data-detail issues"><span>{title}</span></div>
        <div className="oom-report-details_item-table_data-detail button"><button onClick={toggleVisibility} className='icon-svg plain'>{isVisible ? <KeyboardArrowDownIcon sx={{ fontSize: 24 }} /> : <KeyboardArrowUpIcon sx={{ fontSize: 24 }} />}</button></div>
      </div>

      <div className={`oom-report-details_item-table_data-content ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="oom-report-details_item-table_data-content-table">

          {reports.length > 0 && (
            <div className="oom-report-details_item-table_data-content_headings">
              <div className={`oom-report-details_item-table_data-content_heading oom-column-${isMissingType ? '90' : '40'} page-url`}>
                <input
                  className="oom-report-details_item-table_data-content_heading_checkbox"
                  type="checkbox"
                  issue-item="all"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <p className="oom-report-details_item-table_data-content_heading_title">Pages With Issues</p>
              </div>

              {!isMissingType && (
                <>
                  <div className="oom-report-details_item-table_data-content_heading oom-column-30 title">
                    <p className="oom-report-details_item-table_data-content_heading_title">Description</p>
                  </div>

                  <div className="oom-report-details_item-table_data-content_heading oom-column-10 required-length">
                    <p className="oom-report-details_item-table_data-content_heading_title">{capitalizeFirst(lengthType)} Length</p>
                  </div>

                  <div className="oom-report-details_item-table_data-content_heading oom-column-10 title-length">
                    <p className="oom-report-details_item-table_data-content_heading_title">Description Length</p>
                  </div>

                  <div className="oom-report-details_item-table_data-content_heading oom-column-5 words">
                    <p className="oom-report-details_item-table_data-content_heading_title">Words</p>
                  </div>
                </>
              )}

              <div className="oom-report-details_item-table_data-content_heading oom-column-10 action">
                <p className="oom-report-details_item-table_data-content_heading_title">Action</p>
              </div>
            </div>
          )}

          {reports.length > 0 ? (
            reports.map((report, index) => (
              <DescriptionItemComponent
                key={index}
                report={report}
                lengthType={lengthType}
                generating={generating}
                generatedContent={generatedContent}
                handleGenerateClick={handleGenerateClick}
                handleCheckboxChange={handleCheckboxChange}
                isMissingType={isMissingType}
              />
            ))
          ) : (
            !loading &&
            <div className="oom-report-details_item-table_data-content_details">
              <div className="oom-report-details_item-table_data-content_detail oom-column-100 no-data">
                <span>No issues found. Good job!</span>
              </div>
            </div>
          )}
        </div>

        {reports.length > 0 && (
          <div className="oom-ai-generator-btn-box">
            <div className="ai-suggest button">
              <button
                title="Generate"
                onClick={handleBulkGenerateClick}
                className='icon-svg gemini-arrow'
                disabled={isGenerating}
                >
                {isGenerating
                  ? <><GeminiIcon /> <span className='text'>Loading...</span></>
                  : <><GeminiIcon /><span className='text'>Ai Generate Selected</span></>
                }
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DescriptionItemsComponent;

