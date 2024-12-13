import React from 'react';
import H2h4ItemsComponent from './H2h4ItemsComponent';

const H2h4IssueComponent = ({issue2, issue3, loading, generating, generatedContent, handleGenerateClick}) => {
    return (
        <div id="issues-h2-h4" className="oom-report-details_item">
            <div className="oom-report-details_item-title">
                <span>H2-H4</span>
            </div>
            <div className="oom-report-details_item-table_data">
                <H2h4ItemsComponent
                    title="H2-h4 too long"
                    lengthType="maximum"
                    reports={issue2}
                    loading={loading}
                    generating={generating}
                    generatedContent={generatedContent}
                    handleGenerateClick={handleGenerateClick}
                />
                
                <H2h4ItemsComponent
                    title="H2-h4 too short"
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

export default H2h4IssueComponent;