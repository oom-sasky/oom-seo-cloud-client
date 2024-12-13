import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthHeaders } from '../../context/AuthContext';
import useProject from '../../hooks/useProject';
import { io } from 'socket.io-client';
import TitleIssueComponent from '../../components/reports/TitleIssueComponent';
import DescriptionIssueComponent from '../../components/reports/DescriptionIssueComponent';
import H1IssueComponent from '../../components/reports/H1IssueComponent';
import H2h4IssueComponent from '../../components/reports/H2h4IssueComponent';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import("../../assets/css/AuditResults.css");

const tagIcon = '../../assets/img/tag-min.png';
const endPointServer = process.env.REACT_APP_OOM_SEO_API_SERVER;
const endPointAuditReports = process.env.REACT_APP_OOM_SEO_API_AUDIT_REPORTS;
const endPointGenerate = process.env.REACT_APP_OOM_SEO_API_GENERATE;
const socket = io(`${endPointServer}`);

const AuditResults = ({ id }) => {
    const [titleReportsIssue1, setTitleReportsIssue1] = useState([]);
    const [titleReportsIssue2, setTitleReportsIssue2] = useState([]);
    const [titleReportsIssue3, setTitleReportsIssue3] = useState([]);
    const [titleErrorReportsTotal, setTitleErrorReportsTotal] = useState(0);
    const [titleWarningReportsTotal, setTitleWarningReportsTotal] = useState(0);
    const [descriptionReportsIssue1, setDescriptionReportsIssue1] = useState([]);
    const [descriptionReportsIssue2, setDescriptionReportsIssue2] = useState([]);
    const [descriptionReportsIssue3, setDescriptionReportsIssue3] = useState([]);
    const [descriptionErrorReportsTotal, setDescriptionErrorReportsTotal] = useState(0);
    const [descriptionWarningReportsTotal, setDescriptionWarningReportsTotal] = useState(0);
    const [h1ReportsIssue2, setH1ReportsIssue2] = useState([]);
    const [h1ReportsIssue3, setH1ReportsIssue3] = useState([]);
    const [h1ErrorReportsTotal, setH1ErrorReportsTotal] = useState(0);
    const [h1WarningReportsTotal, setH1WarningReportsTotal] = useState(0);
    const [h2h4ReportsIssue2, setH2h4ReportsIssue2] = useState([]);
    const [h2h4ReportsIssue3, setH2h4ReportsIssue3] = useState([]);
    const [h2h4WarningReportsTotal, setH2h4WarningReportsTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState({});

    const headers = useAuthHeaders();
    const { project } = useProject(id, headers);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const reportsResponse = await axios.get(
                    `${endPointAuditReports}/${id}`,
                    {
                        headers,
                    }
                );

                if (reportsResponse.data && reportsResponse.status === 200) {
                    const reportsData = reportsResponse.data;

                    const filterReportsTitleIssue1 = reportsData.filter(report =>
                        report.fetchSuccessful &&
                        report.pageData &&
                        report.pageData.headers.status === 200 &&
                        report.pageData.title.has_issue === true &&
                        report.pageData.title.issue_type === "1"
                    );
                    const totalFilterReportsTitleIssue1 = filterReportsTitleIssue1.length;
                    const reportsTitleIssue1 = await Promise.all(filterReportsTitleIssue1.map(async (item) => {
                        let metadata = { generated_content: '' };
                        try {
                            // Fetch metadata for each report asynchronously
                            const metadataResponse = await axios.get(
                                `${endPointGenerate}`,
                                {
                                    params: {
                                        project_id: id,
                                        page_url: item.pageUrl,
                                        generate_type: "title",
                                        socket_id: socket.id

                                    },
                                    headers,
                                }
                            );
                            metadata = metadataResponse.data || metadata;
                        } catch (error) {
                            console.error(`Error fetching metadata for ${item.pageUrl}:`, error);
                        }
                        // Return the item with the metadata added
                        return {
                            ...item,
                            metadata,
                        };
                    }));
                    setTitleReportsIssue1(reportsTitleIssue1);

                    const filterReportsTitleIssue2 = reportsData.filter(report =>
                        report.fetchSuccessful &&
                        report.pageData &&
                        report.pageData.headers.status === 200 &&
                        report.pageData.title.has_issue === true &&
                        report.pageData.title.issue_type === "2"
                    );
                    const totalFilterReportsTitleIssue2 = filterReportsTitleIssue2.length;
                    const reportsTitleIssue2 = await Promise.all(filterReportsTitleIssue2.map(async (item) => {
                        let metadata = { generated_content: '' };
                        try {
                            // Fetch metadata for each report asynchronously
                            const metadataResponse = await axios.get(
                                `${endPointGenerate}`,
                                {
                                    params: {
                                        project_id: id,
                                        page_url: item.pageUrl,
                                        generate_type: "title",
                                        socket_id: socket.id

                                    },
                                    headers,
                                }
                            );
                            metadata = metadataResponse.data || metadata;
                        } catch (error) {
                            console.error(`Error fetching metadata for ${item.pageUrl}:`, error);
                        }
                        // Return the item with the metadata added
                        return {
                            ...item,
                            metadata,
                        };
                    }));
                    setTitleReportsIssue2(reportsTitleIssue2);

                    const filterReportsTitleIssue3 = reportsData.filter(report =>
                        report.fetchSuccessful &&
                        report.pageData &&
                        report.pageData.headers.status === 200 &&
                        report.pageData.title.has_issue === true &&
                        report.pageData.title.issue_type === "3"
                    );
                    const totalFilterReportsTitleIssue3 = filterReportsTitleIssue3.length;
                    const reportsTitleIssue3 = await Promise.all(filterReportsTitleIssue3.map(async (item) => {
                        let metadata = { generated_content: '' };
                        try {
                            // Fetch metadata for each report asynchronously
                            const metadataResponse = await axios.get(
                                `${endPointGenerate}`,
                                {
                                    params: {
                                        project_id: id,
                                        page_url: item.pageUrl,
                                        generate_type: "title",
                                        socket_id: socket.id

                                    },
                                    headers,
                                }
                            );
                            metadata = metadataResponse.data || metadata;
                        } catch (error) {
                            console.error(`Error fetching metadata for ${item.pageUrl}:`, error);
                        }
                        // Return the item with the metadata added
                        return {
                            ...item,
                            metadata,
                        };
                    }));
                    setTitleReportsIssue3(reportsTitleIssue3);

                    setTitleErrorReportsTotal(totalFilterReportsTitleIssue1);
                    setTitleWarningReportsTotal(totalFilterReportsTitleIssue2 + totalFilterReportsTitleIssue3);

                    const filterReportsDescriptionIssue1 = reportsData.filter(report =>
                        report.fetchSuccessful &&
                        report.pageData &&
                        report.pageData.headers.status === 200 &&
                        report.pageData.meta_description.has_issue === true &&
                        report.pageData.meta_description.issue_type === "1"
                    );
                    const totalFilterReportsDescriptionIssue1 = filterReportsDescriptionIssue1.length;
                    const reportsDescriptionIssue1 = await Promise.all(filterReportsDescriptionIssue1.map(async (item) => {
                        let metadata = { generated_content: '' };
                        try {
                            // Fetch metadata for each report asynchronously
                            const metadataResponse = await axios.get(
                                `${endPointGenerate}`,
                                {
                                    params: {
                                        project_id: id,
                                        page_url: item.pageUrl,
                                        generate_type: "meta_description",
                                        socket_id: socket.id

                                    },
                                    headers,
                                }
                            );
                            metadata = metadataResponse.data || metadata;
                        } catch (error) {
                            console.error(`Error fetching metadata for ${item.pageUrl}:`, error);
                        }
                        // Return the item with the metadata added
                        return {
                            ...item,
                            metadata,
                        };
                    }));

                    setDescriptionReportsIssue1(reportsDescriptionIssue1);

                    const filterReportsDescriptionIssue2 = reportsData.filter(report =>
                        report.fetchSuccessful &&
                        report.pageData &&
                        report.pageData.headers.status === 200 &&
                        report.pageData.meta_description.has_issue === true &&
                        report.pageData.meta_description.issue_type === "2"
                    );
                    const totalFilterReportsDescriptionIssue2 = filterReportsDescriptionIssue2.length;
                    const reportsDescriptionIssue2 = await Promise.all(filterReportsDescriptionIssue2.map(async (item) => {
                        let metadata = { generated_content: '' };
                        try {
                            // Fetch metadata for each report asynchronously
                            const metadataResponse = await axios.get(
                                `${endPointGenerate}`,
                                {
                                    params: {
                                        project_id: id,
                                        page_url: item.pageUrl,
                                        generate_type: "meta_description",
                                        socket_id: socket.id

                                    },
                                    headers,
                                }
                            );
                            metadata = metadataResponse.data || metadata;
                        } catch (error) {
                            console.error(`Error fetching metadata for ${item.pageUrl}:`, error);
                        }
                        // Return the item with the metadata added
                        return {
                            ...item,
                            metadata,
                        };
                    }));

                    setDescriptionReportsIssue2(reportsDescriptionIssue2);

                    const filterReportsDescriptionIssue3 = reportsData.filter(report =>
                        report.fetchSuccessful &&
                        report.pageData &&
                        report.pageData.headers.status === 200 &&
                        report.pageData.meta_description.has_issue === true &&
                        report.pageData.meta_description.issue_type === "3"
                    );
                    const totalFilterReportsDescriptionIssue3 = filterReportsDescriptionIssue3.length;
                    const reportsDescriptionIssue3 = await Promise.all(filterReportsDescriptionIssue3.map(async (item) => {
                        let metadata = { generated_content: '' };
                        try {
                            // Fetch metadata for each report asynchronously
                            const metadataResponse = await axios.get(
                                `${endPointGenerate}`,
                                {
                                    params: {
                                        project_id: id,
                                        page_url: item.pageUrl,
                                        generate_type: "meta_description",
                                        socket_id: socket.id

                                    },
                                    headers,
                                }
                            );
                            metadata = metadataResponse.data || metadata;
                        } catch (error) {
                            console.error(`Error fetching metadata for ${item.pageUrl}:`, error);
                        }
                        // Return the item with the metadata added
                        return {
                            ...item,
                            metadata,
                        };
                    }));

                    setDescriptionReportsIssue3(reportsDescriptionIssue3);

                    setDescriptionErrorReportsTotal(totalFilterReportsDescriptionIssue1);
                    setDescriptionWarningReportsTotal(totalFilterReportsDescriptionIssue2 + totalFilterReportsDescriptionIssue3);


                    const filterReportsH1Issue2 = reportsData.filter(report =>
                        report.fetchSuccessful &&
                        report.pageData &&
                        report.pageData.headers.status === 200 &&
                        report.pageData.headings.has_multiple_h1 === false &&
                        report.pageData.headings.heading_tags.some(tag => tag.heading === "h1" &&
                            tag.has_issue === true &&
                            tag.issue_type === "2")
                    );

                    const totalFilterReportsH1Issue2 = filterReportsH1Issue2.length;
                    const reportsH1Issue2 = await Promise.all(filterReportsH1Issue2.map(async (item) => {
                        let metadata = { generated_content: '' };
                        try {
                            // Fetch metadata for each report asynchronously
                            const metadataResponse = await axios.get(
                                `${endPointGenerate}`,
                                {
                                    params: {
                                        project_id: id,
                                        page_url: item.pageUrl,
                                        generate_type: "heading_h1",
                                        current_content: item.pageData.headings.heading_tags.filter(tag => tag.heading === "h1").map(heading => heading.text),
                                        socket_id: socket.id

                                    },
                                    headers,
                                }
                            );
                            metadata = metadataResponse.data || metadata;
                        } catch (error) {
                            console.error(`Error fetching metadata for ${item.pageUrl}:`, error);
                        }
                        // Return the item with the metadata added
                        return {
                            ...item,
                            metadata,
                        };
                    }));

                    setH1ReportsIssue2(reportsH1Issue2);

                    const filterReportsH1Issue3 = reportsData.filter(report =>
                        report.fetchSuccessful &&
                        report.pageData &&
                        report.pageData.headers.status === 200 &&
                        report.pageData.headings.has_multiple_h1 === false &&
                        report.pageData.headings.heading_tags.some(tag => tag.heading === "h1" &&
                            tag.has_issue === true &&
                            tag.issue_type === "3")
                    );

                    const totalFilterReportsH1Issue3 = filterReportsH1Issue3.length;
                    const reportsH1Issue3 = await Promise.all(filterReportsH1Issue3.map(async (item) => {
                        let metadata = { generated_content: '' };
                        try {
                            // Fetch metadata for each report asynchronously
                            const metadataResponse = await axios.get(
                                `${endPointGenerate}`,
                                {
                                    params: {
                                        project_id: id,
                                        page_url: encodeURIComponent(item.pageUrl),
                                        generate_type: "heading_h1",
                                        current_content: item.pageData.headings.heading_tags.filter(tag => tag.heading === "h1").map(heading => heading.text),
                                        socket_id: socket.id

                                    },
                                    headers,
                                }
                            );
                            metadata = metadataResponse.data || metadata;
                            // console.log(metadata);
                        } catch (error) {
                            // console.error(`Error fetching metadata for ${item.pageUrl}:`, error);
                        }
                        // Return the item with the metadata added
                        return {
                            ...item,
                            metadata,
                        };
                    }));

                    setH1ReportsIssue3(reportsH1Issue3);

                    setH1ErrorReportsTotal(0);
                    setH1WarningReportsTotal(totalFilterReportsH1Issue2 + totalFilterReportsH1Issue3);


                    const filterReportsH2h4Issue2 = reportsData
                        .filter(report =>
                            report.fetchSuccessful &&
                            report.pageData &&
                            report.pageData.headers.status === 200 &&
                            report.pageData.headings.heading_tags.some(tag =>
                                tag.heading !== "h1" && tag.has_issue === true && tag.issue_type === "2"
                            )
                        );

                    // Get the total count of the filtered reports
                    const totalFilterReportsH2h4Issue2 = filterReportsH2h4Issue2.length;

                    // Now, you can proceed with your existing map function to fetch metadata for each report
                    const reportsH2h4Issue2 = filterReportsH2h4Issue2
                        .map(async (item) => {
                            const relevantHeadings = item.pageData.headings.heading_tags.filter(
                                tag => tag.heading !== "h1" && tag.has_issue === true && tag.issue_type === "2"
                            );

                            const heading_metadata = await Promise.all(
                                relevantHeadings.map(async (tag) => {
                                    let metadata = { generated_content: '' };
                                    try {
                                        // Fetch metadata for each report asynchronously
                                        const metadataResponse = await axios.get(
                                            `${endPointGenerate}`,
                                            {
                                                params: {
                                                    project_id: id,
                                                    page_url: item.pageUrl,
                                                    generate_type: "heading",
                                                    content_id: tag.id,
                                                    socket_id: socket.id
            
                                                },
                                                headers,
                                            }
                                        );
                                        metadata = metadataResponse.data || metadata;
                                    } catch (error) {
                                        // console.error(`Error fetching metadata for ${item.page_url} (heading: ${tag.heading}):`, error);
                                    }
                                    return {
                                        ...tag,
                                        metadata,
                                    };
                                })
                            );

                            return {
                                ...item,
                                heading_metadata,
                            };
                        });

                    const reportsH2h4Issue2Data = await Promise.all(reportsH2h4Issue2);
                    setH2h4ReportsIssue2(reportsH2h4Issue2Data);


                    const filterReportsH2h4Issue3 = reportsData
                        .filter(report =>
                            report.fetch_successful &&
                            report.pageData &&
                            report.pageData.headers.status === 200 &&
                            report.pageData.headings.heading_tags.some(tag =>
                                tag.heading !== "h1" && tag.has_issue === true && tag.issue_type === "3"
                            )
                        );

                    // Get the total count of the filtered reports
                    const totalFilterReportsH2h4Issue3 = filterReportsH2h4Issue3.length;

                    // Now, you can proceed with your existing map function to fetch metadata for each report
                    const reportsH2h4Issue3 = filterReportsH2h4Issue3
                        .map(async (item) => {
                            const relevantHeadings = item.pageData.headings.heading_tags.filter(
                                tag => tag.heading !== "h1" && tag.has_issue === true && tag.issue_type === "3"
                            );

                            const heading_metadata = await Promise.all(
                                relevantHeadings.map(async (tag) => {
                                    let metadata = { generated_content: '' };
                                    try {
                                        // Fetch metadata for each report asynchronously
                                        const metadataResponse = await axios.get(
                                            `${endPointGenerate}`,
                                            {
                                                params: {
                                                    project_id: id,
                                                    page_url: item.pageUrl,
                                                    generate_type: "heading",
                                                    content_id: tag.id,
                                                    socket_id: socket.id
            
                                                },
                                                headers,
                                            }
                                        );
                                        metadata = metadataResponse.data || metadata;
                                        console.log(metadata);
                                    } catch (error) {
                                        // console.error(`Error fetching metadata for ${item.page_url} (heading: ${tag.heading}):`, error);
                                    }
                                    return {
                                        ...tag,
                                        metadata,
                                    };
                                })
                            );

                            return {
                                ...item,
                                heading_metadata,
                            };
                        });

                    const reportsH2h4Issue3Data = await Promise.all(reportsH2h4Issue3);
                    setH2h4ReportsIssue3(reportsH2h4Issue3Data);

                    setH2h4WarningReportsTotal(totalFilterReportsH2h4Issue2 + totalFilterReportsH2h4Issue3);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [id, headers]);


    const UsageMetaDisplay = ({ usageMeta }) => {
        if (!usageMeta) return null;
        return (
            <div className='usage-token-list'>
                <div className='prompt heading'>
                    <span className='label'>Prompt Token</span>
                    <span className='value'>{usageMeta.promptTokenCount || 'N/A'}</span>
                </div>
                <div className='candidate heading'>
                    <span className='label'>Candidate Token</span>
                    <span className='value'>{usageMeta.candidatesTokenCount || 'N/A'}</span>
                </div>
                <div className='total heading'>
                    <span className='label'>Total Token</span>
                    <span className='value'>{usageMeta.totalTokenCount || 'N/A'}</span>
                </div>
            </div>
        );
    };

    const handleGenerateClick = async (report, reportType, page_url, page_content) => {
        const contentKey =
            reportType === 'meta_description'
                ? (report.pageData.meta_description.text || page_url) // Use page_url if meta_description.text is empty
                : reportType === 'heading_h1'
                    ? report.pageData.headings.heading_tags
                        .filter(tag => tag.heading === "h1")
                        .map(heading => heading.text)
                    : reportType === 'heading'
                        ? report.text
                        : (report.pageData.title.text || page_url);

        setGenerating(prev => ({
            ...prev,
            [contentKey]: true,
        }));

        const postData = {
            project_id: id,
            page_url: page_url,
            content_id: reportType === 'heading' ? report.id : "",
            page_content: page_content,
            generate_type: reportType,
            current_content:
                reportType === 'meta_description'
                    ? (report.pageData.meta_description.text || page_url)
                    : reportType === 'heading_h1'
                        ? report.pageData.headings.heading_tags
                            .filter(tag => tag.heading === "h1")
                            .map(heading => heading.text)
                        : reportType === 'heading'
                            ? report.text
                            : (report.pageData.title.text || page_url),
            socket_id: socket.id,
        };

        try {
            const metadataResponse = await axios.post(
                `${endPointGenerate}`,
                postData,
                { headers }
            );

            const metadataResult = metadataResponse.data;

            setGeneratedContent((prevContent) => ({
                ...prevContent,
                [contentKey]: (
                    <React.Fragment>
                        <div className='suggested-content-container'>
                            <div className='suggested-label'>
                                <span>Suggested {reportType === 'title' ? 'Title' :
                                    reportType === 'meta_description' ? 'Description' :
                                        reportType === 'heading_h1' ? 'H1' :
                                            reportType === 'heading' ? 'H2-H4' : null}:
                                </span>
                            </div>
                            <div className='suggested-content'>
                                {metadataResult.generated_content || 'Error generating content'}
                            </div>

                            <div className='usage-content'>
                                <div className='usage-label'><span>Token Summary</span></div>
                                <UsageMetaDisplay usageMeta={metadataResult.usage_meta} />
                            </div>
                        </div>
                    </React.Fragment>
                ),
            }));
            console.log('Response from generation:', metadataResult);
        } catch (error) {
            console.error('Error generating content:', error);
        } finally {
            setGenerating((prev) => ({
                ...prev,
                [contentKey]: false,
            }));
        }
    };


    return (
        <React.Fragment>
            <div className="oom-page-attributes breadcrumb audit-results">
                <p className="oom-page-attributes_breadcrumb">Website Audit</p>
                <p className="oom-page-attributes_title">
                    Website Audit <span className="highlight">/ Results</span> <span className="highlight">/ {project.projectName }</span>
                </p>
            </div>

            <div className="oom-page-results">
                <div className="oom-page-left__navigation oom-report-navigations">
                    <a className="oom-report-navigation_link" href="#issues-title">
                        <div className="oom-report-navigation_link_type">
                            <img src={tagIcon} className="oom-report-navigation_link_type-icon" alt="Issue Title Icon" />
                            Title
                        </div>

                        <div className="oom-report-navigation_link_details">
                            <div className="oom-report-navigation_link_detail errors">
                                <span className="icon-svg circle sm error"><CloseIcon sx={{ fontSize: 12 }} /></span>
                                {titleErrorReportsTotal}
                            </div>

                            <div className="oom-report-navigation_link_detail warnings">
                                <span className="icon-svg circle sm warning"><WarningIcon sx={{ fontSize: 12 }} /></span>
                                {titleWarningReportsTotal}
                            </div>
                        </div>
                    </a>

                    <a className="oom-report-navigation_link" href="#issues-meta-description">
                        <div className="oom-report-navigation_link_type">
                            <img src={tagIcon} className="oom-report-navigation_link_type-icon" alt="Issue Meta Description Icon" />
                            Meta Description
                        </div>

                        <div className="oom-report-navigation_link_details">
                            <div className="oom-report-navigation_link_detail errors">
                                <span className="icon-svg circle sm error"><CloseIcon sx={{ fontSize: 12 }} /></span>
                                {descriptionErrorReportsTotal}
                            </div>

                            <div className="oom-report-navigation_link_detail warnings">
                                <span className="icon-svg circle sm warning"><WarningIcon sx={{ fontSize: 12 }} /></span>
                                {descriptionWarningReportsTotal}
                            </div>
                        </div>
                    </a>

                    <a className="oom-report-navigation_link" href="#issues-h1">
                        <div className="oom-report-navigation_link_type">
                            <img src={tagIcon} className="oom-report-navigation_link_type-icon" alt="Issue H1 Icon" />
                            H1
                        </div>

                        <div className="oom-report-navigation_link_details">
                            <div className="oom-report-navigation_link_detail errors">
                                <span className="icon-svg circle sm error"><CloseIcon sx={{ fontSize: 12 }} /></span>
                                {h1ErrorReportsTotal}
                            </div>

                            <div className="oom-report-navigation_link_detail warnings">
                                <span className="icon-svg circle sm warning"><WarningIcon sx={{ fontSize: 12 }} /></span>
                                {h1WarningReportsTotal}
                            </div>
                        </div>
                    </a>

                    <a className="oom-report-navigation_link" href="#issues-h2-h4">
                        <div className="oom-report-navigation_link_type">
                            <img src={tagIcon} className="oom-report-navigation_link_type-icon" alt="Issue H2-H4 Icon" />
                            H2-H4
                        </div>

                        <div className="oom-report-navigation_link_details">
                            <div className="oom-report-navigation_link_detail warnings">
                                <span className="icon-svg circle sm warning"><WarningIcon sx={{ fontSize: 12 }} /></span>
                                {h2h4WarningReportsTotal}
                            </div>
                        </div>
                    </a>
                </div>

                <div className="oom-report-details">
                    <TitleIssueComponent
                        issue1={titleReportsIssue1}
                        issue2={titleReportsIssue2}
                        issue3={titleReportsIssue3}
                        loading={loading}
                        generating={generating}
                        generatedContent={generatedContent}
                        handleGenerateClick={handleGenerateClick}
                    />

                    <DescriptionIssueComponent
                        issue1={descriptionReportsIssue1}
                        issue2={descriptionReportsIssue2}
                        issue3={descriptionReportsIssue3}
                        loading={loading}
                        generating={generating}
                        generatedContent={generatedContent}
                        handleGenerateClick={handleGenerateClick}
                    />

                    <H1IssueComponent
                        issue2={h1ReportsIssue2}
                        issue3={h1ReportsIssue3}
                        loading={loading}
                        generating={generating}
                        generatedContent={generatedContent}
                        handleGenerateClick={handleGenerateClick}
                    />

                    <H2h4IssueComponent
                        issue2={h2h4ReportsIssue2}
                        issue3={h2h4ReportsIssue3}
                        loading={loading}
                        generating={generating}
                        generatedContent={generatedContent}
                        handleGenerateClick={handleGenerateClick}
                    />
                </div>

            </div>
        </React.Fragment>
    )
};

export default AuditResults;