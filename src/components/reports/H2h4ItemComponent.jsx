import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import GeminiIcon from '../elements/GeminiIcon';

const H2h4ItemComponent = ({ lengthType, report, generating, generatedContent, handleGenerateClick, handleCheckboxChange }) => {
    const { pageUrl, pageContent, heading_metadata } = report;

    // Managing visibility per heading item using a map (keyed by heading text)
    const [visibilityState, setVisibilityState] = useState({});

    const toggleVisibility = (headingText) => {
        setVisibilityState(prevState => ({
            ...prevState,
            [headingText]: !prevState[headingText]  // Toggle visibility for the specific heading
        }));
    };

    return (
        <React.Fragment>
            {heading_metadata.map((headingItem, headingIndex) => {
                const isDisabled = generatedContent[headingItem.text] || headingItem.metadata.generated_content || generating[headingItem.text];
                const isVisible = visibilityState[headingItem.text] || false; // Check visibility state for current heading

                const headingReport = {
                    text: headingItem.text,
                    page_url: pageUrl,
                    page_content: pageContent
                };

                const handleCheckbox = (e) => {
                    handleCheckboxChange(headingReport, e.target.checked);
                };
                return (
                    <div key={headingIndex} className="oom-report-details_item-table_data-content_details_box">
                        <div className="oom-report-details_item-table_data-content_details">
                            <div className="oom-report-details_item-table_data-content_detail page-url oom-column-30">
                                <input
                                    className={`oom-report-details_item-table_data-content_detail_checkbox ${isDisabled ? 'is-hidden' : ''}`}
                                    type="checkbox"
                                    issue-item="all"
                                    disabled={isDisabled}
                                    onChange={handleCheckbox}
                                />
                                <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="oom-report-details_item-table_data-content_detail_title">{pageUrl}</a>
                            </div>
                            <div className="oom-report-details_item-table_data-content_detail oom-column-30 text">{headingItem.text}</div>
                            <div className="oom-report-details_item-table_data-content_detail oom-column-10 heading-type">{headingItem.heading}</div>
                            <div className="oom-report-details_item-table_data-content_detail oom-column-10 required-length">{lengthType === 'maximum' ? 55 : 10}</div>
                            <div className="oom-report-details_item-table_data-content_detail oom-column-5 length">{headingItem.length}</div>
                            <div className="oom-report-details_item-table_data-content_detail oom-column-5 words">{headingItem.words}</div>
                            <div className="oom-report-details_item-table_data-content_detail oom-column-10 actions">
                                {generatedContent[headingItem.text] || headingItem.metadata.generated_content ? (
                                    !isVisible && (
                                        <button onClick={() => toggleVisibility(headingItem.text)}className='icon-svg circle'>
                                            <AddIcon sx={{ fontSize: 14 }} />
                                        </button>
                                    )
                                ) : (
                                    <>
                                        <div className={`ai-suggest ${isVisible ? 'is-hidden' : ''}`}>
                                            <GeminiIcon />
                                            <span className='text'>Ai</span>
                                        </div>
                                        <button onClick={() => toggleVisibility(headingItem.text)} className='icon-svg circle'>{isVisible ? <RemoveIcon sx={{ fontSize: 14 }} /> : <AddIcon sx={{ fontSize: 14 }} />}</button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={`oom-report-details_item-table_data-content_ai-box_modal ${isVisible ? 'visible' : 'hidden'}`}>
                            <div className="oom-report-details_item-table_data-content_ai-box">
                                <div className="oom-report-details_item-table_data-content_ai-box-close">
                                    <button onClick={() => toggleVisibility(headingItem.text)} className='icon-svg plain'><CloseIcon sx={{ fontSize: 10 }} /></button>
                                </div>
                                <div className="oom-report-details_item-table}_data-content_ai-box-title"><span className='ai-recommendation'><strong>Recommendation</strong></span></div>
                                <div className="oom-report-details_item-table_data-content_ai-box-text">
                                    <div className='ai-suggest-container'>
                                        <div className='ai-suggest-text'>
                                            {!headingItem.metadata.generated_content && !generatedContent[headingItem.text] ? (
                                                <span>Allow me to analyze and provide a tailored recommendation</span>
                                            ) : <span>Here’s what I suggest based on my findings</span>}
                                        </div>

                                        <div className='ai-suggest button'>
                                            {generating[headingItem.text] ? (
                                                <button
                                                    title="Generate"
                                                    className='icon-svg gemini-arrow'
                                                    disabled={generating[headingItem.text] || !!(generatedContent[headingItem.text] || headingItem.metadata.generated_content)}
                                                >
                                                    {generating[headingItem.text]
                                                        ? <><GeminiIcon /> <span className='text'>Loading...</span></>
                                                        : <><GeminiIcon /><span className='text'>Ai Generate</span></>
                                                    }
                                                </button>

                                            ) : (
                                                <button
                                                    title="Generate"
                                                    onClick={() => handleGenerateClick(headingItem, 'heading', pageUrl, pageContent)}
                                                    className='icon-svg gemini-arrow'
                                                    disabled={generating[headingItem.text] || !!(generatedContent[headingItem.text] || headingItem.metadata.generated_content)}
                                                >
                                                    {generating[headingItem.text]
                                                        ? <><GeminiIcon /> <span className='text'>Loading...</span></>
                                                        : <><GeminiIcon /><span className='text'>Ai Generate</span></>
                                                    }
                                                </button>

                                            )}

                                        </div>
                                    </div>

                                    <div className='ai-suggested-content'>
                                        {generating[headingItem.text] && (
                                            <div className='ai-loader'>
                                                <span></span><span></span><span></span><span></span>
                                            </div>
                                        )}

                                        {headingItem.metadata.generated_content && (
                                            <div className='suggested-content-container'>
                                                <div className='suggested-label'><span>Suggested H1</span></div>
                                                <div className='suggested-content'>
                                                    {headingItem.text}
                                                </div>

                                                {headingItem.metadata.usage_meta && headingItem.metadata.usage_meta.length > 0 && (
                                                    <div className='usage-content'>
                                                        <div className='usage-label'><span>Token Summary</span></div>
                                                        <div className='usage-token-list'>
                                                            <div className='prompt heading'>
                                                                <span className='label'>Prompt Token</span>
                                                                <span className='value'>{headingItem.metadata.usage_meta[0].promptTokenCount}</span>
                                                            </div>
                                                            <div className='candidate heading'>
                                                                <span className='label'>Candidate Token</span>
                                                                <span className='value'>{headingItem.metadata.usage_meta[0].candidatesTokenCount}</span>
                                                            </div>
                                                            <div className='total heading'>
                                                                <span className='label'>Total Token</span>
                                                                <span className='value'>{headingItem.metadata.usage_meta[0].totalTokenCount}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {generatedContent[headingItem.text]}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </React.Fragment>
    );
};

export default H2h4ItemComponent;
