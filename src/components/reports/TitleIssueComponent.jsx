import React from 'react';
import TitleItemsComponent from './TitleItemsComponent';

const TitleIssueComponent = ({issue1, issue2, issue3, loading, generating, generatedContent, handleGenerateClick}) => {
    return (
        <div id="issues-title" className="oom-report-details_item">
            <div className="oom-report-details_item-title">
                <span>Title</span>
            </div>
            <div className="oom-report-details_item-table_data">
                <TitleItemsComponent
                    title="Title missing"
                    reports={issue1}
                    loading={loading}
                    generating={generating}
                    generatedContent={generatedContent}
                    handleGenerateClick={handleGenerateClick}
                    isMissingType={true}
                />

                <TitleItemsComponent
                    title="Title too long"
                    lengthType="maximum"
                    reports={issue2}
                    loading={loading}
                    generating={generating}
                    generatedContent={generatedContent}
                    handleGenerateClick={handleGenerateClick}
                    isMissingType={false}
                />
                
                <TitleItemsComponent
                    title="Title too short"
                    lengthType="minimum"
                    reports={issue3}
                    loading={loading}
                    generating={generating}
                    generatedContent={generatedContent}
                    handleGenerateClick={handleGenerateClick}
                    isMissingType={false}
                />
            </div>
        </div>
    );
};

export default TitleIssueComponent;