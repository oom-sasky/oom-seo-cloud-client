/**
 * Content Generation
 *
 * @since 1.0.0
 *
 * @package OOmAISEOTools
 * @author  OOm Developer (oom_ss)
 */

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuthHeaders } from '../../context/AuthContext';
import useProjects from '../../hooks/useProjects';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, TextField, MenuItem } from '@mui/material';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import InfoIcon from '@mui/icons-material/Info';
import { formatNumber } from '../../utils/formatNumber';
import { capitalizeString } from '../../utils/capitalizeString';
import MonthlySearchChart from '../../components/widgets/MonthlySearchChart';
import 'react-tooltip/dist/react-tooltip.css';
import "../../assets/css/ContentGeneration.css";

export default function ContentGeneration({ id }) {
    const navigate = useNavigate();
    const headers = useAuthHeaders();
    const { projects } = useProjects(headers);
    
    const [loading, setLoading] = useState(false);
    const [generatingTopic, setGeneratingTopic] = useState(false);
    const [generatingPrimaryKeywords, setGeneratingPrimaryKeywords] = useState(false);
    const [generatingTopicContent, setGeneratingTopicContent] = useState(false);
    const [savingPostContent, setSavingPostContent] = useState(false);
    const [generatedPrimaryKeywords, setGeneratedPrimaryKeywords] = useState([]);
    const [generatedTopics, setGeneratedTopics] = useState([]);
    const [generatedTopicImage, setGeneratedTopicImage] = useState([]);
    const [generatedTopicContent, setGeneratedTopicContent] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [customKeywords, setCustomKeywords] = useState([]);
    const [inputKeyword, setInputKeyword] = useState("");
    const [targetAudience, setTargetAudience] = useState(["professionals"]);
    const [inputTargetAudience, setInputTargetAudience] = useState("");
    const [excludeTerms, setExcludeTerms] = useState([]);
    const [inputExcludeTerms, setInputExcludeTerms] = useState("");
    const [inputTextOutline, setInputTextOutline] = useState('');
    const [saveKeywords, setSaveKeywords] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedSaveKeywords, setSelectedSaveKeywords] = useState([]);
    const [selectedPrimaryKeywords, setSelectedPrimaryKeywords] = useState([]);
    const [currentPrimaryKeywords, setCurrentPrimaryKeywords] = useState("");
    const [currentTopics, setCurrentTopics] = useState("");
    const [currentTopicImage, setCurrentTopicImage] = useState("");
    const [currentTopicContent, setCurrentTopicContent] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState("english");
    const [selectedContentLength, setSelectedContentLength] = useState("1000-1500");
    const [keywordData, setKeywordData] = useState({});
    const [selectedChartData, setSelectedChartData] = useState(null);
    const [monthlySearchVolumesModal, setMonthlySearchVolumesModal] = useState(false);
    const [postContent, setPostContent] = useState([]);
    const [postContentName, setPostContentName] = useState("");

    const endPointPostContent = process.env.REACT_APP_OOM_SEO_API_POST_CONTENT;
    const endPointGeneratedHistories = process.env.REACT_APP_OOM_SEO_API_GENERATED_HISTORIES;

    useEffect(() => {
        const fetchPostContent = async () => {
            try {
                const response = await axios.get(
                    `${endPointPostContent}/${id}`,
                    {
                        headers,
                    }
                );

                if (response.data && response.status === 200) {
                    setPostContent(response.data);
                    const responseData = response.data.post;
                    const mainKeywords = responseData.mainKeywords.split(',').map(keyword => keyword.trim());
                    const additionalKeywords = responseData.additionalKeywords.split(',').map(keyword => keyword.trim());
                    let selectedPrimaryKeywords = [];
                    let targetAudienceText = [];
                    let excludeTermsText = [];

                    if (responseData.selectedPrimaryKeywords && responseData.selectedPrimaryKeywords.trim() !== "") {
                        selectedPrimaryKeywords = responseData.selectedPrimaryKeywords.split(',').map(keyword => keyword.trim());
                    }
                    if (responseData.targetAudience && responseData.targetAudience.trim() !== "") {
                        targetAudienceText = responseData.targetAudience.split(',').map(keyword => keyword.trim());
                    }
                    
                    if (responseData.excludeTerms && responseData.excludeTerms.trim() !== "") {
                        excludeTermsText = responseData.excludeTerms.split(',').map(keyword => keyword.trim());
                    }
                    setSelectedSaveKeywords(mainKeywords);
                    setSelectedProject(responseData.projectId);
                    setCurrentPrimaryKeywords(responseData.primaryKeywords);
                    setPostContentName(responseData.postName);
                    if (responseData.additionalKeywords !== "" && additionalKeywords.length > 0) {
                        setCustomKeywords([additionalKeywords]);
                    } else {
                        setCustomKeywords([]);
                    }

                    if (responseData.selectedPrimaryKeywords !== "" && selectedPrimaryKeywords.length > 0) {
                        setSelectedPrimaryKeywords(selectedPrimaryKeywords);
                        setSelectedTopic({ primary_keywords: selectedPrimaryKeywords, topic: responseData.selectedTopic, overview: responseData.selectedTopicOverview,  });
                    } else {
                        setSelectedPrimaryKeywords([]);
                        setSelectedTopic(null);
                    }

                    if (responseData.topics) {
                        setCurrentTopics(responseData.topics);
                    }

                    if (responseData.topicImage) {
                        setCurrentTopicImage(responseData.topicImage);
                    }

                    if (responseData.topicContent) {
                        setCurrentTopicContent(responseData.topicContent);
                    }

                    if (responseData.language) {
                        setSelectedLanguage(responseData.language);
                    }

                    if (responseData.contentOutline) {
                        setInputTextOutline(responseData.contentOutline);
                    }

                    if (responseData.contentLength) {
                        setSelectedContentLength(responseData.contentLength);
                    }

                    if (responseData.targetAudience !== "" && targetAudienceText.length > 0) {
                        setTargetAudience(targetAudienceText);
                    }

                    if (responseData.excludeTerms !== "" && excludeTermsText.length > 0) {
                        setExcludeTerms(excludeTermsText);
                    }
                } else {
                    // navigate('/ai-generation/new/');
                }
            } catch (err) {
                console.error(err);
                // navigate('/ai-generation/new/');
            }
        };

        if (id && id !== 'new') {
            fetchPostContent();
        }
    }, [endPointPostContent, headers, id, navigate]);


    useEffect(() => {
        const fetchGeneratedHistoryPrimaryKeywords = async () => {
            try {
                const response = await axios.get(
                    `${endPointGeneratedHistories}/${currentPrimaryKeywords}`,
                    {
                        headers,
                    }
                );
                if (response.data && response.status === 200) {
                    const parseResponse = JSON.parse(response.data.history.generatedContent);
                    if (response.data.history.projectId === selectedProject) {
                        setGeneratedPrimaryKeywords(parseResponse);
                    } else {
                        setGeneratedPrimaryKeywords([]);
                    }
                }
            } catch (err) {
                // console.error(err);
            }
        };

        const fetchGeneratedHistoryTopics = async () => {
            try {
                const response = await axios.get(
                    `${endPointGeneratedHistories}/${currentTopics}`,
                    {
                        headers,
                    }
                );
                if (response.data && response.status === 200) {
                    const parseResponse = JSON.parse(response.data.history.generatedContent);
                    if (response.data.history.projectId === selectedProject) {
                        setGeneratedTopics(parseResponse);
                    } else {
                        setGeneratedTopics([]);
                    }
                }
            } catch (err) {
                // console.error(err);
            }
        };

        const fetchGeneratedHistoryTopicImage = async () => {
            try {
                const response = await axios.get(
                    `${endPointGeneratedHistories}/${currentTopicImage}`,
                    {
                        headers,
                    }
                );

                if (response.data && response.status === 200) {
                    const parseResponse = response.data.history.generatedContent;
                    if (response.data.history.projectId === selectedProject) {
                        setGeneratedTopicImage(parseResponse);
                    } else {
                        setGeneratedTopicImage([]);
                    }
                }
            } catch (err) {
                // console.error(err);
            }
        };

        const fetchGeneratedHistoryTopicContent = async () => {
            try {
                const response = await axios.get(
                    `${endPointGeneratedHistories}/${currentTopicContent}`,
                    {
                        headers,
                    }
                );
                if (response.data && response.status === 200) {
                    const parseResponse = JSON.parse(response.data.history.generatedContent);
                    if (response.data.history.projectId === selectedProject) {
                        setGeneratedTopicContent(parseResponse);
                    } else {
                        setGeneratedTopicContent([]);
                    }
                }
            } catch (err) {
                // console.error(err);
            }
        };

        if (id && id !== 'new') {
            if (currentPrimaryKeywords) {
                fetchGeneratedHistoryPrimaryKeywords();
            }

            if (currentTopics) {
                fetchGeneratedHistoryTopics();
            }

            if (currentTopicImage) {
                fetchGeneratedHistoryTopicImage();
            }

            if (currentTopicContent) {
                fetchGeneratedHistoryTopicContent();
            }
        }
    }, [id, endPointPostContent, endPointGeneratedHistories, headers, postContent, generatedTopicImage, selectedProject, selectedPrimaryKeywords, currentPrimaryKeywords, currentTopics, currentTopicImage, currentTopicContent]);

    const getKeywordData = useCallback(async (keyword) => {
        try {
            const endPointKeywordData = process.env.REACT_APP_OOM_SEO_API_KEYWORD_DATA;
            const response = await axios.get(
                `${endPointKeywordData}`,
                {
                    params: {
                        keyword: keyword,
                    },
                    headers,
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Failed to retrieve data for keyword "${keyword}":`, error);
            return null;
        }
    }, [headers]);

    useEffect(() => {
        const fetchKeywords = async () => {
            setSelectedSaveKeywords([]);
            if (!selectedProject) return;

            try {
                const endPointKeywordManager = process.env.REACT_APP_OOM_SEO_API_KEYWORD_MANAGER;
                const response = await axios.get(
                    `${endPointKeywordManager}`,
                    {
                        params: {
                            project_id: selectedProject,
                            keyword_type: 'blog',
                        },
                        headers,
                    }
                );
                let keywords = [];
                if (response.data && response.status === 200) {
                    keywords = response.data.keywords;
                }
                setSaveKeywords(keywords);
            } catch (error) {
                console.error('Error retrieving keywords:', error);
                if (error.response && error.response.status === 401) {
                    alert('Unauthorized: Please log in again.');
                }
            }
        };
        fetchKeywords();
    }, [headers, selectedProject]);

    useEffect(() => {
        const fetchAllKeywordsData = async () => {
            const keywordData = {};
            // Combine saveKeywords and generatedPrimaryKeywords into one array
            const allKeywords = [...(saveKeywords || []), ...(generatedPrimaryKeywords || [])];

            // Iterate over all keywords and fetch data
            for (const keyword of allKeywords) {
                const apiData = await getKeywordData(keyword.keyword);
                if (apiData) {
                    keywordData[keyword.keyword] = apiData.data;
                }
            }
            setKeywordData(keywordData);  // Update state with the fetched data
        };

        // Only fetch if there are any keywords in either list
        if ((saveKeywords.length > 0) || (generatedPrimaryKeywords.length > 0)) {
            fetchAllKeywordsData();
        }
    }, [headers, saveKeywords, generatedPrimaryKeywords, getKeywordData]);


    const handleOpenModal = (data) => {
        setSelectedChartData(data); // Set the data for the chart
        setMonthlySearchVolumesModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setMonthlySearchVolumesModal(false);
        setSelectedChartData(null); // Optionally clear the chart data when closing
    };

    const handleSelectedSaveKeywords = (event, keyword) => {
        if (event.target.checked) {
            setSelectedSaveKeywords((prevSelected) => [...prevSelected, keyword]);
        } else {
            setSelectedSaveKeywords((prevSelected) =>
                prevSelected.filter((k) => k !== keyword)
            );
        }
    };

    const handleSelectedPrimaryKeywords = (event, keyword) => {
        if (event.target.checked) {
            setSelectedPrimaryKeywords((prevSelected) => [...prevSelected, keyword]);
        } else {
            setSelectedPrimaryKeywords((prevSelected) =>
                prevSelected.filter((k) => k !== keyword)
            );
        }
    };

    const handleSelectedTopic = (topIndex, ideaIndex) => {
        const topic = generatedTopics[topIndex];
        const ideas = topic?.topic_ideas[ideaIndex];
        if (selectedTopic?.topic === ideas.title) {
            setSelectedTopic(null);
        } else if (topic && ideas) {
            setSelectedTopic({ primary_keywords: topic.selected_primary_keyword, topic: ideas.title, overview: ideas.overview });
        }
    };

    const handleProjectChange = (e) => {
        setSelectedProject(e.target.value);
    };

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };

    const handleContentLengthChange = (e) => {
        setSelectedContentLength(e.target.value);
    };

    const validatedLanguage = ['english', 'chinese', 'french', 'spanish'].includes(selectedLanguage) ? selectedLanguage : '';
    const validatedContentLength = ['300-600', '600-1000', '1000-1500', '1500-3000', '3000-6000'].includes(selectedContentLength) ? selectedContentLength : '';

    const handleGeneratePrimaryKeywords = async () => {
        const keywords = [...selectedSaveKeywords, ...customKeywords].join(', ');
        const keywordsTotal = keywords.split(',').map(item => item.trim());

        if (keywords.length <= 0) {
            toast.error("Please select or enter atleast 1 keyword");
            return;
        }

        if (keywordsTotal.length > 5) {
            toast.info("Allowed Maximum 5 Keywords only including additional/custom keywords");
            return;
        }

        setLoading(true);
        setGeneratingPrimaryKeywords(true);
        try {
            const endPointGeneratePrimaryKeywords = process.env.REACT_APP_OOM_SEO_API_GENERATE_PRIMARY_KEYWORDS;
            const response = await axios.post(
                `${endPointGeneratePrimaryKeywords}`,
                { keywords: keywords, project_id: selectedProject },
                { headers: headers }
            );
            const parseResponse = JSON.parse(response.data.generated_content);
            setGeneratedPrimaryKeywords(parseResponse);

            if (id && id === 'new') {
                const postResponse = await axios.post(
                    `${endPointPostContent}`,
                    {
                        project_id: selectedProject,
                        main_keywords: selectedSaveKeywords.join(', '),
                        additional_keywords: customKeywords.join(', '),
                        primary_keywords: response.data.id,
                    },
                    { headers }
                );
                if (postResponse.data && postResponse.status === 200) {
                    navigate(`/ai-generation/${postResponse.data.id}`);
                }
            } else {
                if (response.data.id !== selectedPrimaryKeywords) {
                    try {
                        const updateResponse = await axios.put(
                            `${endPointPostContent}/${id}`,
                            {
                                post_name: postContentName,
                                project_id: selectedProject,
                                main_keywords: selectedSaveKeywords.join(','),
                                additional_keywords: customKeywords.join(','),
                                primary_keywords: response.data.id,
                            },
                            { headers: headers }
                        );

                        if (updateResponse.status === 200) {
                            toast.success("Primary Keywords Generated successfully");
                        }
                    } catch (error) {
                        toast.error("Something went wrong!");
                        console.error('Error updating post content:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error generating primary keywords:', error);
        } finally {
            setLoading(false);
            setGeneratingPrimaryKeywords(false);
        }
    };

    const handleGenerateTopic = async (e) => {
        e.preventDefault();
        const keywords = [...selectedSaveKeywords, ...customKeywords].join(', ');
        if (keywords.length <= 0) {
            toast.error("Please select or enter atleast 1 keyword");
            return;
        }

        if (selectedPrimaryKeywords.length <= 0 || selectedPrimaryKeywords.length > 3) {
            toast.error("Please select atleast 3 Primary keywords");
            return;
        }

        setLoading(true);
        setGeneratingTopic(true);
        try {
            const endPointGenerateTopic = process.env.REACT_APP_OOM_SEO_API_GENERATE_TOPIC;
            const response = await axios.post(
                `${endPointGenerateTopic}`,
                { primary_keywords: selectedPrimaryKeywords, main_keywords: selectedSaveKeywords, project_id: selectedProject },
                { headers: headers }
            );
            const parseResponse = JSON.parse(response.data.generated_content);
            setGeneratedTopics(parseResponse);

            if (response.data && response.status === 200) {
                try {
                    const updateResponse = await axios.put(
                        `${endPointPostContent}/${id}`,
                        {
                            post_name: postContentName,
                            project_id: selectedProject,
                            main_keywords: selectedSaveKeywords.join(','),
                            additional_keywords: customKeywords.join(','),
                            primary_keywords: currentPrimaryKeywords,
                            selected_primary_keywords: selectedPrimaryKeywords.join(','),
                            topics: response.data.id
                        },
                        { headers: headers }
                    );

                    if (updateResponse.status === 200) {
                        toast.success("Topics Generated successfully");
                    }
                } catch (error) {
                    toast.error("Something went wrong!");
                    console.error('Error updating post content:', error);
                }
            }

        } catch (error) {
            console.error('Error generating topic:', error);
        } finally {
            setLoading(false);
            setGeneratingTopic(false);
        }
    };

    const handleGenerateTopicContent = async (e) => {
        e.preventDefault();
        if (!selectedTopic) {
            toast.error("Please select Topic to generate content");
            return;
        }

        if (targetAudience.length <= 0) {
            toast.error("Please enter at least one audience");
            return;
        }

        setLoading(true);
        setGeneratingTopicContent(true);
        try {
            const endPointGenerateTopicContent = process.env.REACT_APP_OOM_SEO_API_GENERATE_TOPIC_CONTENT;
            
            const response = await axios.post(
                `${endPointGenerateTopicContent}`,
                {
                    topic: selectedTopic.topic,
                    topic_overview: selectedTopic.overview,
                    primary_keywords: selectedTopic.primary_keywords,
                    project_id: selectedProject,
                    language: selectedLanguage,
                    outline: inputTextOutline,
                    words: selectedContentLength,
                    audience: targetAudience.join(', ')
                },
                { headers: headers }
            );
            const parseResponse = JSON.parse(response.data.generated_content);
            setGeneratedTopicContent(parseResponse);

            if (response.data && response.status === 200) {
                try {
                    const updateResponse = await axios.put(
                        `${endPointPostContent}/${id}`,
                        {
                            post_name: postContentName,
                            project_id: selectedProject,
                            main_keywords: selectedSaveKeywords.join(','),
                            additional_keywords: customKeywords.join(','),
                            primary_keywords: currentPrimaryKeywords,
                            selected_primary_keywords: selectedPrimaryKeywords.join(','),
                            topics: currentTopics,
                            topic_image: response.data.generated_image_id,
                            selected_topic: selectedTopic.topic,
                            selected_topic_overview: selectedTopic.overview,
                            topic_content: response.data.id,
                            specific_language: selectedLanguage,
                            outline: inputTextOutline,
                            length: selectedContentLength,
                            audience: inputTargetAudience,
                            exclude_terms: inputExcludeTerms
                        },
                        { headers: headers }
                    );

                    if (updateResponse.status === 200) {
                        toast.success("Content Generated successfully");
                    }
                } catch (error) {
                    toast.error("Something went wrong!");
                    console.error('Error updating post content:', error);
                }
            }

        } catch (error) {
            console.error('Error generating topic content:', error);
        } finally {
            setLoading(false);
            setGeneratingTopicContent(false);
        }
    };

    const handleSavePostContent = async (e) => {
        e.preventDefault();
        if (!selectedSaveKeywords.length) {
            toast.error("Please select atleast one keyword");
            return;
        }

        try {
            setLoading(true);
            setSavingPostContent(true);
            const response = await axios.put(
                `${endPointPostContent}/${id}`,
                {
                  post_name: postContentName || '',
                  project_id: selectedProject || '',
                  main_keywords: selectedSaveKeywords.length ? selectedSaveKeywords.join(',') : '',
                  additional_keywords: customKeywords.length ? customKeywords.join(',') : '',
                  primary_keywords: currentPrimaryKeywords || '',
                  selected_primary_keywords: selectedPrimaryKeywords.length ? selectedPrimaryKeywords.join(',') : '',
                  topics: currentTopics || '',
                  selected_topic: selectedTopic?.topic || '',
                  selected_topic_overview: selectedTopic?.overview || '',
                  topic_content: currentTopicContent || '',
                  language: selectedLanguage || '',
                  outline: inputTextOutline || '',
                  length: selectedContentLength || '',
                  audience: targetAudience.length ? targetAudience.join(',') : '',
                  exclude_terms: excludeTerms.length ? excludeTerms.join(',') : ''
                },
                { headers: headers }
            );

            if (response.status === 200) {
                toast.success("Updated successfully");
            }
        } catch (error) {
            console.error('Error updating post content:', error);
        } finally {
            setLoading(false);
            setSavingPostContent(false);
        }
    };

    const handleInputChangeKeyword = (e) => {
        setInputKeyword(e.target.value);
    };

    const handleInputChangeAudience = (e) => {
        setInputTargetAudience(e.target.value);
    };

    const handleInputChangeExcludeTerms = (e) => {
        setInputExcludeTerms(e.target.value);
    };

    const handleKeyPressKeyword = (e) => {
        if (e.key === "Enter" && inputKeyword.trim()) {
            e.preventDefault();
            if (!customKeywords.includes(inputKeyword.trim())) {
                setCustomKeywords([...customKeywords, inputKeyword.trim()]);
            }
            setInputKeyword("");
        }
    };

    const handleKeyPressAudience = (e) => {
        if (e.key === "Enter" && inputTargetAudience.trim()) {
            e.preventDefault();
            if (!targetAudience.includes(inputTargetAudience.trim())) {
                setTargetAudience([...targetAudience, inputTargetAudience.trim()]);
            }
            setInputTargetAudience("");
        }
    };

    const handleKeyPressExcludeTerms = (e) => {
        if (e.key === "Enter" && inputExcludeTerms.trim()) {
            e.preventDefault();
            if (!excludeTerms.includes(inputExcludeTerms.trim())) {
                setExcludeTerms([...excludeTerms, inputExcludeTerms.trim()]);
            }
            setInputExcludeTerms("");
        }
    };

    const handleGenerateNew = () => {
        navigate('/ai-generation/new/');
        setPostContentName("");
        setSelectedProject("");
        setSaveKeywords([]);
        setCustomKeywords([]);
        setGeneratedPrimaryKeywords([]);
        setGeneratedTopics("");
        setGeneratedTopicContent("");
    };

    const handleInputPostName = (event) => {
        setPostContentName(event.target.value);
    };

    const handleInputTextOutline = (event) => {
        setInputTextOutline(event.target.value);
    };

    const removeCustomKeyword = (indexToRemove) => {
        setCustomKeywords(customKeywords.filter((_, index) => index !== indexToRemove));
    };

    const removeTargetAudience = (indexToRemove) => {
        setTargetAudience(targetAudience.filter((_, index) => index !== indexToRemove));
    };

    const removeExcludeTerms = (indexToRemove) => {
        setExcludeTerms(excludeTerms.filter((_, index) => index !== indexToRemove));
    };

    const renderContent = (data) => {
        console.log(data);
        if (Array.isArray(data)) {
            // Render each item in the array
            return data.map((item, index) => <React.Fragment key={index}>{renderContent(item)}</React.Fragment>);
        } else if (typeof data === "object" && data !== null) {
            // Render each key-value pair in the object
            return Object.entries(data).map(([key, value], index) => {
                const uniqueKey = `${key}-${index}`;
                switch (key) {
                    case "p":
                        return <p key={index}>{value}</p>;
                    case "h2":
                        return <h2 key={index}>{value}
                            <InfoIcon sx={{ fontSize: 14 }} className='tooltip-icon' data-tooltip-id={`content-h2-${value}`} data-tooltip-place="right" />
                            <Tooltip id={`content-h2-${value}`} className='tooltip-container'>
                                <strong>H2</strong>
                                <p>characters length - {value.length}</p>
                            </Tooltip></h2>;
                    case "h3":
                        return <h3 key={index}>{value}
                            <InfoIcon sx={{ fontSize: 14 }} className='tooltip-icon' data-tooltip-id={`content-h3-${index}`} data-tooltip-place="right" />
                            <Tooltip id={`content-h3-${index}`} className='tooltip-container'>
                                <strong>H3</strong>
                                <p>characters length - {value.length}</p>
                            </Tooltip></h3>;
                    case "h4":
                        return <h4 key={index}>{value}
                            <InfoIcon sx={{ fontSize: 14 }} className='tooltip-icon' data-tooltip-id={`content-h4-${index}`} data-tooltip-place="right" />
                            <Tooltip id={`content-h4-${index}`} className='tooltip-container'>
                                <strong>H4</strong>
                                <p>characters length - {value.length}</p>
                            </Tooltip></h4>;
                    case "ul":
                        return (
                            <ul key={index}>
                                {value.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        );
                    case "faqs":
                        return (
                            <div key={index}>
                                <h3>FAQs</h3>
                                {value.map((faq, i) => (
                                    <div key={i}>
                                        <strong>Q: {faq.q}</strong>
                                        <p>A: {faq.a}</p>
                                    </div>
                                ))}
                            </div>
                        );
                    case "table":
                        return (
                            <table key={index} border="1">
                                <thead>
                                    <tr>
                                        {value.headers.map((header, i) => (
                                            <th key={i}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                {/* <tbody>
                                    {value.rows.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((cell, j) => (
                                                <td key={j}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody> */}
                            </table>
                        );
                    case "ol":
                        return (
                            <ol key={index}>
                                {value.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ol>
                        );
                    default:
                        // Render Q&A pairs
                        if (data.q && data.a) {
                            return (
                                <div className='faq-item' key={uniqueKey}>
                                    <p className='faq-question'>{data.q}</p>
                                    <p className='faq-answer'>{data.a}</p>
                                </div>
                            );
                        }
                        return renderContent(value);
                }
            });
        } else {
            return data;
        }
    };

    return (
        <React.Fragment>

            <div className='oom-page-attributes breadcrumb ai-generation'>
                <p className="oom-page-attributes_breadcrumb">AI Generation / <span className="highlight">Content Generation</span></p>
                <p className="oom-page-attributes_title">
                    AI Generation <span className="highlight">/ {postContentName ? postContentName : "Generate New"}</span>
                </p>
            </div>
            <div className='oom-form_list_container ai-generation'>
                {id && id !== 'new' && (
                    <div className='oom-field-container__row flex-direction-row justify'>
                        <div className='oom-field-container__row flex-direction-row'>
                            <div className="oom-field-container__row_heading">
                                <span className="container__heading">Content Generation Name:</span>
                            </div>

                            <div className='oom-field oom-text-field custom-width'>
                                <TextField
                                    // label="Enter Your Blog Name"
                                    variant="outlined"
                                    placeholder="e.g. AI and Beyond in Content Generation"
                                    disabled={loading}
                                    value={postContentName}
                                    onChange={handleInputPostName}
                                    fullWidth
                                />
                            </div>
                        </div>

                        <div className='oom-field-container__row flex-direction-row'>
                            <button onClick={handleSavePostContent} title="Save Post Content" className='oom-button oom-btn-loader action' disabled={savingPostContent}>
                                <span className='text'>Save</span>
                            </button>
                            <button onClick={handleGenerateNew} title="Generate New Content" className='oom-button oom-btn-loader action'>
                                <span className='text'>Generate New</span>
                            </button>
                        </div>

                    </div>
                )}

                <div className='oom-field-container__row flex-direction-row'>

                    <div className='oom-field-container__row_heading'>
                        <span className='container__heading'>Select keywords from:</span>
                    </div>

                    <Select
                        labelId="project-select-label"
                        className='oom-field oom-field-select material'
                        value={selectedProject}
                        onChange={handleProjectChange}
                        fullWidth
                        disabled={loading}
                    >

                        <MenuItem disabled value="">
                            Select Project
                        </MenuItem>

                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <MenuItem key={project._id} value={project._id}>
                                    {project.projectName}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No projects found</MenuItem>
                        )}
                    </Select>
                </div>

                <div className='oom-field-container__row'>
                    <div className="oom-page-results__details saved-keyword-ideas">
                        <div className="oom-page-results__details_results">
                            <div className="oom-page-results__details_results_sub_heading">
                                <span>Keywords Ideas</span>
                            </div>

                            <table className="oom-page-results__details_results_table">
                                <thead className="oom-page-results__details_results_table_heading">
                                    <tr>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-30"><span>Keywords</span></th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-10"><span>Search Volume </span></th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-10"><span>History </span></th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-15"><span>CPC (low range)</span></th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-15"><span>CPC (high range)</span></th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-20"><span>Competition</span></th>
                                    </tr>
                                </thead>
                                <tbody className="oom-page-results__details_results_items">
                                    {(Array.isArray(saveKeywords) && saveKeywords.length > 0) ? (
                                        saveKeywords.map((keyword) => {
                                            const monthlySearchVolumes = keywordData[keyword.keyword]?.metrics?.monthly_search_volumes || [];
                                            return (
                                                <tr key={keyword._id} className="oom-page-results__details_results_table_item">
                                                    <td className="column-item oom-column-30">
                                                        <div className="keyword-input">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedSaveKeywords.includes(keyword.keyword)}
                                                                disabled={loading}
                                                                onChange={(e) => handleSelectedSaveKeywords(e, keyword.keyword)}
                                                            />
                                                            <div className='keyword-container'>
                                                                <span className='keyword'>{keyword.keyword}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="column-item oom-column-10">
                                                        <div className='search-volume'>
                                                            <span>
                                                                {formatNumber(monthlySearchVolumes.slice(-1)[0]?.monthly_searches) || "..."}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="column-item oom-column-10">
                                                        <div className='history'>
                                                            {monthlySearchVolumes.length > 0 && (
                                                                <MonthlySearchChart
                                                                    changeDisplay={false}
                                                                    monthlySearchVolumes={monthlySearchVolumes}
                                                                    onClick={() => handleOpenModal(monthlySearchVolumes)}
                                                                />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="column-item oom-column-15">
                                                        <div className='cpc-low'>
                                                            <span>SGD {(keyword.keyword_idea_metrics?.low_top_of_page_bid_micros / 1000000 || 0).toFixed(2)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="column-item oom-column-15">
                                                        <div className='cpc-high'>
                                                            <span>SGD {(keyword.keyword_idea_metrics?.high_top_of_page_bid_micros / 1000000 || 0).toFixed(2)}</span>
                                                        </div>
                                                    </td>
                                                    <td className="column-item oom-column-20">
                                                        <div className='history'>
                                                            <span>SGD {(keyword.keyword_idea_metrics?.high_top_of_page_bid_micros / 1000000 || 0).toFixed(2)}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (

                                        <tr>
                                            <td colSpan={6} className="no-found">
                                                {selectedProject ? (
                                                    <p>
                                                        No saved keywords found. Please add keywords using the{' '}
                                                        <a
                                                            href="/research/keyword-research"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="link-underline"
                                                        >
                                                            Keyword Planner
                                                        </a>{' '}
                                                        to proceed.
                                                    </p>
                                                ) : (
                                                    <p>Select project</p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className='oom-field-container__row'>
                    <div className='oom-field-container__row_heading'>
                        <span className='container__heading'>
                            Additional keywords
                            <InfoIcon sx={{ fontSize: 14 }} className='tooltip-icon' data-tooltip-id="additional-keywords" data-tooltip-place="right" />
                            <Tooltip id="additional-keywords" className='tooltip-container'>
                                <strong>Tips</strong>
                                <p>Try not to be too specific or general. For example, "meal delivery" is better than "meals" for a food delivery business.</p>
                            </Tooltip>
                        </span>
                    </div>

                    <div className="custom-inputs">
                        {customKeywords.map((customKeyword, index) => (
                            <div className="custom-keywords" key={index}>
                                {customKeyword}
                                <span className="remove-item" onClick={() => removeCustomKeyword(index)}>
                                    &times;
                                </span>
                            </div>
                        ))}
                        <input
                            type="text"
                            value={inputKeyword}
                            disabled={loading}
                            onChange={handleInputChangeKeyword}
                            onKeyPress={handleKeyPressKeyword}
                            placeholder="Try &quot;meal delivery&quot; or &quot;leather boots&quot;"
                        />
                    </div>
                </div>


                {saveKeywords.length > 0 && (
                    <React.Fragment>
                        <div className='oom-field-container__row'>
                            <div className='oom-field-container__row_action'>
                                {!loading && (
                                    <button onClick={handleGeneratePrimaryKeywords} title="Generate Primary Keywords" className='oom-button oom-btn-loader action' disabled={generatingPrimaryKeywords}>
                                        {generatingPrimaryKeywords
                                            ?
                                            <>
                                                <span className='text loading'>Loading</span>
                                                <span className="ellipsis-loader"><span></span><span></span><span></span><span></span></span>
                                            </>

                                            : <span className='text'>Generate Primary Keywords</span>
                                        }
                                    </button>
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                )}

                {generatedPrimaryKeywords.length > 0 && !generatingPrimaryKeywords && (

                    <div className='oom-field-container__row'>

                        <div className='oom-field-container__row_heading'>
                            <span className='container__heading'>Generate Topic</span>
                            <span className='container__sub_heading'>Choose Keywords to generate topic
                                <InfoIcon sx={{ fontSize: 14 }} className='tooltip-icon' data-tooltip-id="generate-topic" data-tooltip-place="right" />
                                <Tooltip id="generate-topic" className='tooltip-container'>
                                    <strong>Tips</strong>
                                    <p>Select primary keywords to proceed (maximum 3).</p>
                                </Tooltip>
                            </span>
                        </div>

                        <div className="oom-page-results__details generated-primary-keywords">
                            <div className="oom-page-results__details_results">

                                <table className="oom-page-results__details_results_table">
                                    <thead className="oom-page-results__details_results_table_heading">
                                        <tr>
                                            <th className="oom-page-results__details_results_table_heading_item oom-column-60"><span>Generated Primary Keywords</span></th>
                                            <th className="oom-page-results__details_results_table_heading_item oom-column-20"><span>Total Volume</span></th>
                                            <th className="oom-page-results__details_results_table_heading_item oom-column-20"><span>History</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="oom-page-results__details_results_items">
                                        {(Array.isArray(generatedPrimaryKeywords) ? generatedPrimaryKeywords : []).map((keyword, index) => {
                                            const monthlySearchVolumes = keywordData[keyword.keyword]?.metrics?.monthly_search_volumes || [];
                                            return (
                                                <tr key={index} className="oom-page-results__details_results_table_item">
                                                    <td className="column-item oom-column-60">
                                                        <div className="keyword-input">
                                                            <input
                                                                type="checkbox"
                                                                disabled={loading}
                                                                checked={selectedPrimaryKeywords.includes(keyword.keyword)}
                                                                onChange={(e) => handleSelectedPrimaryKeywords(e, keyword.keyword)}
                                                            />
                                                            <div className="keyword-container">
                                                                <span className='keyword'>{keyword.keyword}</span>
                                                                <span className='description'><InfoIcon sx={{ fontSize: 14 }} /> {keyword.explanation}</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="column-item oom-column-20">
                                                        <div className='search-volume'>
                                                            <span>
                                                                {formatNumber(monthlySearchVolumes.slice(-1)[0]?.monthly_searches) || "NA"}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="column-item oom-column-20">
                                                        <div className='history'>
                                                            {monthlySearchVolumes.length > 0 && (
                                                                <MonthlySearchChart
                                                                    changeDisplay={false}
                                                                    monthlySearchVolumes={monthlySearchVolumes}
                                                                    onClick={() => handleOpenModal(monthlySearchVolumes)}
                                                                />
                                                            )}
                                                        </div>
                                                    </td>

                                                </tr>
                                            )
                                        }
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {generatedPrimaryKeywords.length > 0 && (
                    <>
                        <div className='oom-field-container__row'>
                            <div className='oom-field-container__row_action'>
                                {!loading && (
                                    <button onClick={handleGenerateTopic} title="Generate Topic" className='oom-button oom-btn-loader action' disabled={generatingTopic}>
                                        {generatingTopic
                                            ?
                                            <>
                                                <span className='text loading'>Loading</span>
                                                <span className="ellipsis-loader"><span></span><span></span><span></span><span></span></span>
                                            </>

                                            : <span className='text'>Generate Topic</span>
                                        }
                                    </button>
                                )}
                            </div>
                        </div>

                        {generatedTopics.length > 0 && !generatingTopic && (
                            <>
                                <div className='oom-field-container__row'>
                                    <div className="oom-page-results__details generated-topics">
                                        <div className="oom-page-results__details_results">
                                            <div className="oom-page-results__details_results_sub_heading">
                                                <span>Generated Topics</span>
                                            </div>

                                            <table className="oom-page-results__details_results_table">
                                                <thead className="oom-page-results__details_results_table_heading">
                                                    <tr>
                                                        <th className="oom-page-results__details_results_table_heading_item oom-column-15"><span>Selected Primary Keywords</span></th>
                                                        <th className="oom-page-results__details_results_table_heading_item oom-column-15"><span>Article Topic</span></th>
                                                        <th className="oom-page-results__details_results_table_heading_item oom-column-20"><span>Article Overview</span></th>
                                                        <th className="oom-page-results__details_results_table_heading_item oom-column-15"><span>Semantic Keywords</span></th>
                                                        <th className="oom-page-results__details_results_table_heading_item oom-column-20"><span>How to Interlink <br />Primary Keyword</span></th>
                                                        <th className="oom-page-results__details_results_table_heading_item oom-column-15"><span>Keywords to Interlinked</span></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="oom-page-results__details_results_items">
                                                    {(selectedPrimaryKeywords.length && Array.isArray(generatedTopics) ? generatedTopics : []).map((topic, topicIndex) => (
                                                        <React.Fragment key={topicIndex}>
                                                            {(Array.isArray(topic.topic_ideas) ? topic.topic_ideas : []).map((idea, ideaIndex) => (
                                                                <tr key={`${topicIndex}-${ideaIndex}`} className="oom-page-results__details_results_table_item">
                                                                    <td className="column-item oom-column-15">
                                                                        <div className="keyword-input">
                                                                            <input
                                                                                type="checkbox"
                                                                                disabled={loading}
                                                                                checked={selectedTopic?.topic === idea.title}
                                                                                onChange={(e) => handleSelectedTopic(topicIndex, ideaIndex)}
                                                                            />
                                                                            <div className='result-text keyword-container'>
                                                                                <span className='keyword'>{capitalizeString(topic.selected_primary_keyword)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    <td className="column-item oom-column-15">
                                                                        <div className='result-text generated-topic-idea'>
                                                                            <span>{idea.title}</span>
                                                                        </div>
                                                                    </td>

                                                                    <td className="column-item oom-column-20">
                                                                        <div className='result-text generated-topic-overview'>
                                                                            <span>{idea.overview}</span>
                                                                        </div>
                                                                    </td>

                                                                    <td className="column-item oom-column-15">
                                                                        <div className='result-text generated-semanrtic-keywords'>
                                                                            <span>{idea.semantic_keywords.join(', ')}</span>
                                                                        </div>
                                                                    </td>

                                                                    <td className="column-item oom-column-20">
                                                                        <div className='result-text generated-how-interlink-primary-keywords'>
                                                                            <span>{idea.how_to_interlink_primary_keywords}</span>
                                                                        </div>
                                                                    </td>

                                                                    <td className="column-item oom-column-15">
                                                                        <div className='result-text generated-semanrtic-keywords'>
                                                                            <span>{idea.keywords_to_interlink.join(', ')}</span>
                                                                        </div>
                                                                    </td>

                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>

                                <div className='oom-field-container__row'>
                                    <div className='oom-field-container__row_heading'>
                                        <span className='container__heading'>Content Generation Prompt</span>
                                        <span className='container__sub_heading'>Choose 1 Topic to generate Content
                                            <InfoIcon sx={{ fontSize: 14 }} className='tooltip-icon' data-tooltip-id="generate-topic-content" data-tooltip-place="right" />
                                            <Tooltip id="generate-topic-content" className='tooltip-container'>
                                                <strong>Tips</strong>
                                                <p>Select a topic to proceed with content generation.</p>
                                            </Tooltip>
                                        </span>
                                    </div>
                                </div>

                                <div className='oom-field-container__row'>
                                    <div className="oom-field-container__row_heading">
                                        <span className="container__heading">Specific Language</span>
                                    </div>

                                    <div className='oom-field'>
                                        <Select
                                            labelId="language-select-label"
                                            value={validatedLanguage}
                                            onChange={handleLanguageChange}
                                            label="Language"
                                        >
                                            <MenuItem value="english">English</MenuItem>
                                            <MenuItem value="chinese">Chinese</MenuItem>
                                            <MenuItem value="french">French</MenuItem>
                                            <MenuItem value="spanish">Spanish</MenuItem>
                                        </Select>
                                    </div>
                                </div>

                                <div className='oom-field-container__row'>
                                    <div className="oom-field-container__row_heading">
                                        <span className="container__heading">Outline</span>
                                    </div>

                                    <div className='oom-field oom-text-field'>
                                        <TextField
                                            label="Paste your pre-prepared outline here."
                                            variant="outlined"
                                            placeholder='Default value: generate an outline before writing, with at least 15 headings/subheadings in a mix of H1–H4 levels.'
                                            value={inputTextOutline}
                                            onChange={handleInputTextOutline}
                                            rows={5}
                                            multiline
                                            fullWidth
                                        />
                                    </div>
                                </div>

                                <div className='oom-field-container__row'>
                                    <div className="oom-field-container__row_heading">
                                        <span className="container__heading">Content Length</span>
                                    </div>

                                    <div className='oom-field'>
                                        <Select
                                            labelId="content-length-select-label"
                                            value={validatedContentLength}
                                            onChange={handleContentLengthChange}
                                            label="Content Length"
                                        >
                                            <MenuItem value="300-600">300 - 600 Words</MenuItem>
                                            <MenuItem value="600-1000">600 - 1000 Words</MenuItem>
                                            <MenuItem value="1000-1500">1000 - 1500 Words</MenuItem>
                                            <MenuItem value="1500-3000">1500 - 3000 Words</MenuItem>
                                            <MenuItem value="3000-6000">3000 - 6000 Words</MenuItem>
                                        </Select>
                                    </div>
                                </div>

                                <div className='oom-field-container__row'>
                                    <div className='oom-field-container__row_heading'>
                                        <span className="container__heading">Target Audience</span>
                                    </div>

                                    <div className="custom-inputs">
                                        {targetAudience.map((audience, index) => (
                                            <div className="custom-keywords" key={index}>
                                                {audience}
                                                <span className="remove-item" onClick={() => removeTargetAudience(index)}>
                                                    &times;
                                                </span>
                                            </div>
                                        ))}

                                        <input
                                            type="text"
                                            value={inputTargetAudience}
                                            disabled={loading}
                                            onChange={handleInputChangeAudience}
                                            onKeyPress={handleKeyPressAudience}
                                            placeholder="e.g. beginners, professionals, entrepreneurs or Business Owners"
                                        />
                                    </div>
                                </div>

                                <div className='oom-field-container__row'>
                                    <div className='oom-field-container__row_heading'>
                                        <span className="container__heading">Exclude Terms</span>
                                    </div>

                                    <div className="custom-inputs">
                                        {excludeTerms.map((excludeTerm, index) => (
                                            <div className="custom-keywords" key={index}>
                                                {excludeTerm}
                                                <span className="remove-item" onClick={() => removeExcludeTerms(index)}>
                                                    &times;
                                                </span>
                                            </div>
                                        ))}

                                        <input
                                            type="text"
                                            value={inputExcludeTerms}
                                            disabled={loading}
                                            onChange={handleInputChangeExcludeTerms}
                                            onKeyPress={handleKeyPressExcludeTerms}
                                            placeholder="e.g. guarantee"
                                        />
                                    </div>
                                </div>

                                <div className='oom-field-container__row'>
                                    <div className='oom-field-container__row_action'>
                                        {!loading && (
                                            <button onClick={handleGenerateTopicContent} title="Generate Content" className='oom-button oom-btn-loader action' disabled={generatingTopicContent}>
                                                {generatingTopicContent
                                                    ?
                                                    <>
                                                        <span className='text loading'>Loading</span>
                                                        <span className="ellipsis-loader"><span></span><span></span><span></span><span></span></span>
                                                    </>
                                                    : <span className='text'>Generate Content</span>
                                                }
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                    </>
                )}

                {generatedTopicContent.title_tag && !generatingTopicContent && (
                    <div className='oom-field-container__row'>
                        <div className='generated-content_container'>
                            <div className='generated-content_topic_overview'>
                                <h4>Topic: {selectedTopic.topic}</h4>
                                <p>Overview: {selectedTopic.overview}</p>
                            </div>

                            <div className='generated-content_meta'>
                                <div className='meta-data title'>
                                    <span className='label'>Title</span>
                                    <span className='value'>{generatedTopicContent.title_tag}</span>
                                </div>

                                <div className='meta-data description'>
                                    <span className='label'>Description</span>
                                    <span className='value'>{generatedTopicContent.meta_description}</span>
                                </div>

                                <div className='meta-data slug'>
                                    <span className='label'>Slug</span>
                                    <span className='value'>{generatedTopicContent.slug}</span>
                                </div>
                            </div>

                            <div className='generated-content'>
                                <div className="generated-content-image">
                                    <img src={generatedTopicImage.file_url}/>
                                </div>
                                <div className='content-heading'><h4>Blog Content:</h4></div>
                                <h1>
                                    {generatedTopicContent.h1}
                                    <InfoIcon sx={{ fontSize: 14 }} className='tooltip-icon' data-tooltip-id="content-h1" data-tooltip-place="right" />
                                    <Tooltip id="content-h1" className='tooltip-container'>
                                        <strong>H1</strong>
                                        <p>characters length - {generatedTopicContent.h1.length}</p>
                                    </Tooltip>
                                </h1>
                                {renderContent(generatedTopicContent.content)}
                                <div className='content-heading'><h4>Conclusions</h4></div>
                                <h2>{generatedTopicContent.conclusion.h2}
                                    <InfoIcon sx={{ fontSize: 14 }} className='tooltip-icon' data-tooltip-id="content-h2-conclusion" data-tooltip-place="right" />
                                    <Tooltip id="content-h2-conclusion" className='tooltip-container'>
                                        <strong>H2</strong>
                                        <p>characters length - {generatedTopicContent.conclusion.h2.length}</p>
                                    </Tooltip>
                                </h2>
                                <p>{generatedTopicContent.conclusion.p}</p>
                                {/* <div className='content-heading'><h4>Reference Links</h4></div>
                                <ul>
                                    {generatedTopicContent.reference_links.map((link, index) => (
                                        <li key={index}>
                                            <a href={link} target="_blank" rel="noopener noreferrer">
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul> */}
                            </div>
                        </div>
                    </div>
                )}

                {generatedTopics.length > 0 && !generatingTopic && (
                    <div className='oom-field-container__row flex-direction-row'>
                        <button onClick={handleSavePostContent} title="Save Post Content" className='oom-button oom-btn-loader action' disabled={savingPostContent}>
                            {loading && !generatingTopicContent
                                ?
                                <>
                                    <span className='text loading'>saving...</span>
                                </>
                                : <span className='text'>Save</span>
                            }
                        </button>
                    </div>
                )}

                {loading && (
                    <div className='ai-loader'>
                        <span></span><span></span><span></span><span></span>
                    </div>
                )}
            </div>

            <Dialog open={monthlySearchVolumesModal} onClose={handleCloseModal}>
                <DialogTitle>Monthly Search Volume</DialogTitle>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    {selectedChartData ? (
                        <MonthlySearchChart monthlySearchVolumes={selectedChartData} changeDisplay={true} />
                    ) : (
                        <p>Loading chart...</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

        </React.Fragment>
    );
}