import React from 'react';
import DescriptionItemsComponent from './DescriptionItemsComponent';

const DescriptionIssueComponent = ({issue1, issue2, issue3, loading, generating, generatedContent, handleGenerateClick}) => {
    return (
        <div id="issues-meta-description" className="oom-report-details_item">
            <div className="oom-report-details_item-title">
                <span>Description</span>
            </div>
            <div className="oom-report-details_item-table_data">
                <DescriptionItemsComponent
                    title="Description missing"
                    reports={issue1}
                    loading={loading}
                    generating={generating}
                    generatedContent={generatedContent}
                    handleGenerateClick={handleGenerateClick}
                    isMissingType={true}
                />

                <DescriptionItemsComponent
                    title="Description too long"
                    lengthType="maximum"
                    reports={issue2}
                    loading={loading}
                    generating={generating}
                    generatedContent={generatedContent}
                    handleGenerateClick={handleGenerateClick}
                    isMissingType={false}
                />
                
                <DescriptionItemsComponent
                    title="Description too short"
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

export default DescriptionIssueComponent;