import React from 'react';
import H1ItemsComponent from './H1ItemsComponent';

const H1IssueComponent = ({issue2, issue3, loading, generating, generatedContent, handleGenerateClick}) => {
    return (
        <div id="issues-h1" className="oom-report-details_item">
            <div className="oom-report-details_item-title">
                <span>H1</span>
            </div>
            <div className="oom-report-details_item-table_data">
                <H1ItemsComponent
                    title="H1 too long"
                    lengthType="maximum"
                    reports={issue2}
                    loading={loading}
                    generating={generating}
                    generatedContent={generatedContent}
                    handleGenerateClick={handleGenerateClick}
                />
                
                <H1ItemsComponent
                    title="H1 too short"
                    lengthType="minimum"
                    reports={issue3}
                    loading={loading}
                    generating={generating}
                    generatedContent={generatedContent}
                    handleGenerateClick={handleGenerateClick}
                />
            </div>
        </div>
    );
};

export default H1IssueComponent;