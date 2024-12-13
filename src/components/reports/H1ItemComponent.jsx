import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import GeminiIcon from '../elements/GeminiIcon';

const H1ItemComponent = ({ lengthType, report, generating, generatedContent, handleGenerateClick, handleCheckboxChange, isChecked }) => {
    const { pageUrl, pageContent, pageData, metadata } = report;
    const { headings } = pageData;
    const headingText = headings.heading_tags.filter(tag => tag.heading === "h1").map(heading => heading.text);
    const headingType = headings.heading_tags.filter(tag => tag.heading === "h1").map(heading => heading.heading);
    const headingLength = headings.heading_tags.filter(tag => tag.heading === "h1").map(heading => heading.length);
    const headingWords = headings.heading_tags.filter(tag => tag.heading === "h1").map(heading => heading.words);
    const isDisabled = generatedContent[headingText] || metadata.generated_content || generating[headingText];
    const [isVisible, setIsVisible] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
        setIsHidden(prev => !prev);
    };

    const handleCheckbox = (e) => {
        handleCheckboxChange(report, e.target.checked);
    };

    return (

        <div className="oom-report-details_item-table_data-content_details_box">
            <div className="oom-report-details_item-table_data-content_details">
                <div className="oom-report-details_item-table_data-content_detail page-url oom-column-40">
                    <input
                        className={`oom-report-details_item-table_data-content_detail_checkbox ${isDisabled ? 'is-hidden' : ''}`}
                        type="checkbox"
                        issue-item="all"
                        disabled={isDisabled}
                        checked={isChecked}
                        onChange={handleCheckbox}
                    />
                    <a href={pageUrl} target="_blank" rel="noopener noreferrer" className="oom-report-details_item-table_data-content_detail_title">{pageUrl}</a>
                </div>
                <div className="oom-report-details_item-table_data-content_detail oom-column-30 text">{headingText}</div>
                <div className="oom-report-details_item-table_data-content_detail oom-column-5 heading-type">{headingType}</div>
                <div className="oom-report-details_item-table_data-content_detail oom-column-10 required-length">{lengthType === 'maximum' ? 70 : 20}</div>
                <div className="oom-report-details_item-table_data-content_detail oom-column-5 length">{headingLength}</div>
                <div className="oom-report-details_item-table_data-content_detail oom-column-5 words">{headingWords}</div>
                <div className="oom-report-details_item-table_data-content_detail oom-column-10 actions">
                    {generatedContent[headingText] || metadata.generated_content ? (
                        !isVisible && (
                            <button onClick={toggleVisibility} className='icon-svg circle'>
                                <AddIcon sx={{ fontSize: 14 }} />
                            </button>
                        )
                    ) : (
                        <>
                            <div className={`ai-suggest ${isHidden ? 'is-hidden' : ''}`}>
                                <GeminiIcon />
                                <span className='text'>Ai</span>
                            </div>
                            <button onClick={toggleVisibility} className='icon-svg circle'>{isVisible ? <RemoveIcon sx={{ fontSize: 14 }} /> : <AddIcon sx={{ fontSize: 14 }} />}</button>
                        </>
                    )}
                </div>
            </div>

            <div className={`oom-report-details_item-table_data-content_ai-box_modal ${isVisible ? 'visible' : 'hidden'}`}>
                <div className="oom-report-details_item-table_data-content_ai-box">
                    <div className="oom-report-details_item-table_data-content_ai-box-close">
                        <button onClick={toggleVisibility} className='icon-svg plain'><CloseIcon sx={{ fontSize: 16 }} /></button>
                    </div>

                    <div className="oom-report-details_item-table}_data-content_ai-box-title"><span className='ai-recommendation'><strong>Recommendation</strong></span></div>
                    <div className="oom-report-details_item-table_data-content_ai-box-text">
                        <div className='ai-suggest-container'>
                            <div className='ai-suggest-text'>
                                {!metadata.generated_content && !generatedContent[headingText] ? (
                                    <span>Allow me to analyze and provide a tailored recommendation</span>
                                ) : <span>Here’s what I suggest based on my findings</span>}
                            </div>

                            <div className='ai-suggest button'>
                                {generating[headingText] ? (
                                    <button
                                        title="Generate"
                                        className='icon-svg gemini-arrow'
                                        disabled={generating[headingText] || !!(generatedContent[headingText] || metadata.generated_content)}
                                    >
                                        {generating[headingText]
                                            ? <><GeminiIcon /> <span className='text'>Loading...</span></>
                                            : <><GeminiIcon /><span className='text'>Ai Generate</span></>
                                        }
                                    </button>

                                ) : (
                                    <button
                                        title="Generate"
                                        onClick={() => handleGenerateClick(report, 'heading_h1', pageUrl, pageContent)}
                                        className='icon-svg gemini-arrow'
                                        disabled={generating[headingText] || !!(generatedContent[headingText] || metadata.generated_content)}
                                    >
                                        {generating[headingText]
                                            ? <><GeminiIcon /> <span className='text'>Loading...</span></>
                                            : <><GeminiIcon /><span className='text'>Ai Generate</span></>
                                        }
                                    </button>

                                )}

                            </div>
                        </div>

                        <div className='ai-suggested-content'>
                            {generating[headingText] && (
                                <div className='ai-loader'>
                                    <span></span><span></span><span></span><span></span>
                                </div>
                            )}

                            {metadata.generated_content && (
                                <div className='suggested-content-container'>
                                    <div className='suggested-label'><span>Suggested H1</span></div>
                                    <div className='suggested-content'>
                                        {generatedContent[headingText] || metadata.generated_content}
                                    </div>

                                    {metadata.usage_meta && metadata.usage_meta.length > 0 && (
                                        <div className='usage-content'>
                                            <div className='usage-label'><span>Token Summary</span></div>
                                            <div className='usage-token-list'>
                                                <div className='prompt heading'>
                                                    <span className='label'>Prompt Token</span>
                                                    <span className='value'>{metadata.usage_meta[0].promptTokenCount}</span>
                                                </div>
                                                <div className='candidate heading'>
                                                    <span className='label'>Candidate Token</span>
                                                    <span className='value'>{metadata.usage_meta[0].candidatesTokenCount}</span>
                                                </div>
                                                <div className='total heading'>
                                                    <span className='label'>Total Token</span>
                                                    <span className='value'>{metadata.usage_meta[0].totalTokenCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {generatedContent[headingText]}

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default H1ItemComponent;
