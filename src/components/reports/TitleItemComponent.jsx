import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import GeminiIcon from '../elements/GeminiIcon';

const TitleItemComponent = ({ report, lengthType, generating, generatedContent, handleGenerateClick, handleCheckboxChange, isChecked, isMissingType }) => {

    const { pageUrl, pageContent, pageData, metadata } = report;
    const { title } = pageData;
    const titleText = title.text;
    const titleLength = title.length;
    const titleWords = title.words;
    const titleKey = titleText || pageUrl;
    const isDisabled = generatedContent[titleText] || metadata.generated_content || generating[titleText];
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
                <div className={`oom-report-details_item-table_data-content_detail page-url oom-column-${isMissingType ? '90' : '40'}`}>
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

                {!isMissingType && (
                    <>
                        <div className="oom-report-details_item-table_data-content_detail oom-column-30 text">{titleText}</div>
                        <div className="oom-report-details_item-table_data-content_detail oom-column-10 required-length">{lengthType === 'maximum' ? 70 : 40}</div>
                        <div className="oom-report-details_item-table_data-content_detail oom-column-10 length">{titleLength}</div>
                        <div className="oom-report-details_item-table_data-content_detail oom-column-5 words">{titleWords}</div>
                    </>
                )}

                <div className="oom-report-details_item-table_data-content_detail oom-column-10 actions">
                    {generatedContent[titleKey] || metadata.generated_content ? (
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
                                {!metadata.generated_content && !generatedContent[titleKey] ? (
                                    <span>Allow me to analyze and provide a tailored recommendation</span>
                                ) : <span>Here’s what I suggest based on my findings</span>}
                            </div>

                            <div className='ai-suggest button'>
                                {generating[titleKey] ? (
                                    <button
                                        title="Generate"
                                        className='icon-svg gemini-arrow'
                                        disabled={generating[titleKey] || !!(generatedContent[titleKey] || metadata.generated_content)}
                                    >
                                        {generating[titleKey]
                                            ? <><GeminiIcon /> <span className='text'>Loading...</span></>
                                            : <><GeminiIcon /><span className='text'>Ai Generate</span></>
                                        }
                                    </button>

                                ) : (
                                    <button
                                        title="Generate"
                                        onClick={() => handleGenerateClick(report, 'title', pageUrl, pageContent)}
                                        className='icon-svg gemini-arrow'
                                        disabled={generating[titleKey] || !!(generatedContent[titleKey] || metadata.generated_content)}
                                    >
                                        {generating[titleKey]
                                            ? <><GeminiIcon /> <span className='text'>Loading...</span></>
                                            : <><GeminiIcon /><span className='text'>Ai Generate</span></>
                                        }
                                    </button>

                                )}

                            </div>
                        </div>

                        <div className='ai-suggested-content'>
                            {generating[titleKey] && (
                                <div className='ai-loader'>
                                    <span></span><span></span><span></span><span></span>
                                </div>
                            )}

                            {metadata.generated_content && (
                                <div className='suggested-content-container'>
                                    <div className='suggested-label'><span>Suggested Title</span></div>
                                    <div className='suggested-content'>
                                        {generatedContent[titleKey] || metadata.generated_content}
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

                            {generatedContent[titleKey]}

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default TitleItemComponent;