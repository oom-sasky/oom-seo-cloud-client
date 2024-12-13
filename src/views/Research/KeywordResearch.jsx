/**
 * Keyword Research
 *
 * @since 1.0.0
 *
 * @package OOmAISEOTools
 * @author  OOm Developer (oom_ss)
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthHeaders } from '../../context/AuthContext';
import useGeoTargetConstants from '../../hooks/useGeoTargetConstants';
import useProjects from '../../hooks/useProjects';
import { toast } from 'react-toastify';
import CustomSelect from '../../components/widgets/CustomSelect';
import MonthlySearchChart from '../../components/widgets/MonthlySearchChart';
import CustomPagination from '../../components/widgets/CustomPagination';
import ItemsInList from '../../components/widgets/ItemsInList';
import AddIcon from '@mui/icons-material/Add';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { formatNumber } from '../../utils/formatNumber';
import "../../assets/css/Loader.css";
import "../../assets/css/KeywordPlanning.css";
import "../../assets/css/KeywordIdeas.css";

export default function KeywordResearch() {
    const headers = useAuthHeaders();
    const { geoTargetData } = useGeoTargetConstants(headers);
    const { projects } = useProjects(headers);

    const [loading, setLoading] = useState(false);
    const [isGeneratedKeywordIdeas, setIsGeneratedKeywordIdeas] = useState(false);
    const [generatedKeywordIdeas, setGeneratedKeywordIdeas] = useState([]);
    const [isSearchKeywords, setSearchKeywords] = useState(false);
    const [customKeywords, setCustomKeywords] = useState([]);
    const [inputKeyword, setInputKeyword] = useState("");
    const [siteURL, setSiteURL] = useState("");
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [startWithActive, setStartWithActive] = useState('keywords');
    const [useType, setUseType] = useState('entire');
    
    const [selectedChartData, setSelectedChartData] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [monthlySearchVolumesModal, setMonthlySearchVolumesModal] = useState(false);
    const [addToListModal, setAddToListModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedKeywordType, setSelectedKeywordType] = useState("");

    const [sortBy, setSortBy] = useState('searchVolume');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    useEffect(() => {
        if (geoTargetData) {
            const singapore = geoTargetData.find(country => country.label === "Singapore");
            if (singapore) {
                setSelectedCountries([{
                    label: singapore.label,
                    value: singapore.value
                }]);
            }
        }
    }, [geoTargetData]);

    const handleAddToListModal = () => {
        if (selectedKeywords.length === 0) {
            toast.error("Please select at least one keyword");
            return;
        }
        setAddToListModal(true);
    };

    const handleAddToListClose = () => {
        setAddToListModal(false);
    };

    const handleAddToListSave = async () => {
        if (!selectedKeywordType || !selectedProject) {
            toast.error("Please select keyword type and project");
            return;
        }
        const endPointKeywordManager = process.env.REACT_APP_OOM_SEO_API_KEYWORD_MANAGER;
        try {
            setSelectedProject("");
            setSelectedKeywordType("");
            setSelectedKeywords([]);
            setAddToListModal(false);
            const response = await axios.post(
                `${endPointKeywordManager}`,
                {
                    project_id: selectedProject,
                    keyword_type: selectedKeywordType?.toLowerCase(),
                    selected_keywords: selectedKeywords.join(','),
                },
                { headers }
            );

            if (response.data) {
                toast.success(response.data.message);
            }

        } catch (error) {
            console.error("Error saving keyword:", error);
            toast.error("Failed to save the keywords. Please try again");
        } finally {
            setLoading(false); 
        }
    };

    const handleKeywordTypeChange = (event) => {
        setSelectedKeywordType(event.target.value);
    };

    const handleProjectChange = (event) => {
        setSelectedProject(event.target.value);
    };

    const handleCheckboxChange = (e, keyword) => {
        if (e.target.checked) {
            setSelectedKeywords((prevSelected) => [...prevSelected, keyword]);
        } else {
            setSelectedKeywords((prevSelected) =>
                prevSelected.filter((item) => item !== keyword)
            );
        }
    };

    const handleOpenModal = (data) => {
        setSelectedChartData(data); 
        setMonthlySearchVolumesModal(true); 
    };

    const handleCloseModal = () => {
        setMonthlySearchVolumesModal(false);
        setSelectedChartData(null); 
    };

    const handleUseTypeChange = (event) => {
        setUseType(event.target.value);
    };

    const handleStartWithTabChange = (tab) => {
        setStartWithActive(tab);
    };

    const handleCountrySelect = (selectedItems) => {
        const newSelectedCountries = selectedItems.filter(item =>
            !selectedCountries.some(selected => selected.value === item.value)
        );
        setSelectedCountries([...selectedCountries, ...newSelectedCountries]);
    };

    const handleSearchKeywords = async () => {
        if (startWithActive === 'keywords' && customKeywords.length === 0) {
            toast.error("Please enter at least one keyword");
            return;
        }

        if (startWithActive === 'website' && siteURL.trim() === "") {
            toast.error("Please enter a valid website URL");
            return;
        }

        setSearchKeywords(true);
        setLoading(true);
        setIsGeneratedKeywordIdeas(true);
        try {
            const endPointKeywordIdeas = process.env.REACT_APP_OOM_SEO_API_KEYWORD_IDEAS;
            try {
                const response = await axios.get(
                    `${endPointKeywordIdeas}`,
                    {
                        params: {
                            keywords: customKeywords.join(','),
                            locations: selectedCountries.map(country => country.value).join(','),
                            start_with: startWithActive,
                            use_type: useType,
                            site_url: siteURL,
                        },
                        headers,
                    }
                );
                if (response.data.status === 200 && response.data.keywords_ideas.length > 0) {
                    setGeneratedKeywordIdeas(response.data.keywords_ideas);
                    setCurrentPage(1);
                }
            } catch (error) {
                console.error('Error generating keyword ideas:', error);
            } finally {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error starting scan:', error);
        } finally {
            setSearchKeywords(false);
        }
    };

    const handleInputChangeKeyword = (e) => {
        setInputKeyword(e.target.value);
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

    const handleCountryRemove = (countryToRemove) => {
        setSelectedCountries(selectedCountries.filter(country => country.value !== countryToRemove.value));
    };

    const handleCustomKeywordRemove = (indexToRemove) => {
        setCustomKeywords(customKeywords.filter((_, index) => index !== indexToRemove));
    };

    const handleUrlChange = (e) => {
        setSiteURL(e.target.value);
    };

    const groupKeywords = (keywords) => {
        const grouped = {};
        keywords.forEach(keyword => {
            const commonWord = keyword.text.split(' ')[0].toLowerCase();
            if (!grouped[commonWord]) {
                grouped[commonWord] = [];
            }
            grouped[commonWord].push(keyword);
        });

        return grouped;
    };

    const countryOptions = geoTargetData ? geoTargetData.map(country => ({
        label: country.label,
        value: country.value
    })) : [];


    const groupedKeywords = groupKeywords(generatedKeywordIdeas);
    const filteredKeywords = selectedGroup
        ? groupedKeywords[selectedGroup] || []
        : generatedKeywordIdeas;

    const totalResults = filteredKeywords.length;
    const totalPages = Math.ceil(totalResults / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const sortedKeywordIdeas = [...filteredKeywords].sort((a, b) => {
        let aMetric, bMetric;

        if (sortBy === 'keyword') {
            // Sorting alphabetically by keyword
            aMetric = a.keyword.toLowerCase();
            bMetric = b.keyword.toLowerCase();
        } else if (sortBy === 'searchVolume') {
            // Sorting by search volume (numerically)
            aMetric = a.keyword_idea_metrics?.monthly_search_volumes.slice(-1)[0]?.monthly_searches || 0;
            bMetric = b.keyword_idea_metrics?.monthly_search_volumes.slice(-1)[0]?.monthly_searches || 0;
        } else if (sortBy === 'competition') {
            // Sorting by competition (numerically)
            aMetric = a.keyword_idea_metrics?.competition_index || 0;
            bMetric = b.keyword_idea_metrics?.competition_index || 0;
        } else if (sortBy === 'cpcLow') {
            // Sorting by CPC (low range)
            aMetric = a.keyword_idea_metrics?.low_top_of_page_bid_micros / 1000000 || 0; // Convert micros to SGD
            bMetric = b.keyword_idea_metrics?.low_top_of_page_bid_micros / 1000000 || 0; // Convert micros to SGD
        } else if (sortBy === 'cpcHigh') {
            // Sorting by CPC (high range)
            aMetric = a.keyword_idea_metrics?.high_top_of_page_bid_micros / 1000000 || 0; // Convert micros to SGD
            bMetric = b.keyword_idea_metrics?.high_top_of_page_bid_micros / 1000000 || 0; // Convert micros to SGD
        }

        return sortOrder === 'desc' ? bMetric - aMetric : aMetric - bMetric;
    });

    const currentItems = sortedKeywordIdeas.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <React.Fragment>
            <div className={`oom-page-attributes breadcrumb keyword-research ${isGeneratedKeywordIdeas ? 'not-visible' : ''}`}>
                <p className="oom-page-attributes_breadcrumb">Research / <span className="highlight">Keyword Planner</span></p>
                <p className="oom-page-attributes_title">
                    Keyword Planner <span className="highlight">/ Keyword Suggestions</span>
                </p>
            </div>

            <div className={`oom-form ${isGeneratedKeywordIdeas ? 'not-visible' : ''}`}>
                <div className='oom-form_list_container oom-form_keywords'>
                    <span className="oom-form_title">Search Keywords</span>

                    <div className="oom-tabs">
                        <button
                            className={`oom-tab-item ${startWithActive === 'keywords' ? 'active' : ''}`}
                            onClick={() => handleStartWithTabChange('keywords')}
                        >
                            <span>Start with keywords</span>
                        </button>
                        <button
                            className={`oom-tab-item ${startWithActive === 'website' ? 'active' : ''}`}
                            onClick={() => handleStartWithTabChange('website')}
                        >
                            <span>Start with a website</span>
                        </button>
                    </div>

                    <div className={`oom-field-container ${startWithActive === 'website' ? 'not-visible' : ''}`}>
                        <div className='custom-inputs style-2'>
                            {customKeywords.map((customKeyword, index) => (
                                <div className="custom-keywords" key={customKeyword}>
                                    {customKeyword}
                                    <span className="remove-item" onClick={() => handleCustomKeywordRemove(index)}>
                                        &times;
                                    </span>
                                </div>
                            ))}
                            <input
                                type="text"
                                value={inputKeyword}
                                onChange={handleInputChangeKeyword}
                                onKeyPress={handleKeyPressKeyword}
                                placeholder="Try &quot;meal delivery&quot; or &quot;leather boots&quot;"
                            />
                        </div>
                    </div>

                    <CustomSelect
                        options={countryOptions}
                        selectedItems={selectedCountries}
                        onSelect={handleCountrySelect}
                        onRemove={handleCountryRemove}
                        multiSelect={true}
                        placeholder={'Select Location'}
                    />

                    <div className='oom-field-container'>
                        <input
                            type="url"
                            className='oom-field'
                            placeholder="https://"
                            value={siteURL}
                            onChange={handleUrlChange}
                        />
                    </div>

                    <div className={`oom-field-container use-type ${startWithActive === 'keywords' ? 'not-visible' : ''}`}>
                        <label>
                            <input
                                type="radio"
                                name="use-type"
                                value="entire"
                                checked={useType === 'entire'}
                                onChange={handleUseTypeChange}
                            />
                            Use the entire site
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="use-type"
                                value="page"
                                checked={useType === 'page'}
                                onChange={handleUseTypeChange}
                            />
                            Use only this page
                        </label>
                    </div>

                    <button onClick={handleSearchKeywords} title="Search Keywords" className='oom-button oom-btn-loader action' disabled={isSearchKeywords}>
                        <span className='text'>Search</span>
                    </button>
                </div>

            </div>

            <div className={`oom-page-attributes breadcrumb keyword-ideas ${!isGeneratedKeywordIdeas ? 'not-visible' : ''}`}>
                <p className="oom-page-attributes_breadcrumb">Research / <span className="highlight">Keyword Planner</span></p>
                <p className="oom-page-attributes_title">
                    Keyword Suggestions <span className="highlight">/ Company A</span>
                </p>
            </div>

            {isGeneratedKeywordIdeas && (
                <div className='oom-page-sub-attributes keywords-provides'>
                    {startWithActive && startWithActive === "keywords" && (
                        <><span>Keywords Provided:</span> <span className='keywords'><ItemsInList items={customKeywords} /></span></>
                    )}

                    {startWithActive && startWithActive === "website" && (
                        <><span>Website Provided:</span> <span className='website'>{siteURL}</span></>
                    )}
                </div>
            )}

            {loading && (
                <div className='ai-loader'>
                    <span></span><span></span><span></span><span></span>
                </div>
            )}

            {!loading && (
                <div className={`oom-page-results keyword-ideas ${!isGeneratedKeywordIdeas ? 'not-visible' : ''}`}>
                    <div className='oom-page-left__navigation oom-page-results__navigation group-filter'>
                        <div className='oom-page-results__navigation_heading'>
                            <span>Group (by relevance)</span>
                        </div>
                        <div className='oom-page-results__navigation_items'>
                            <div
                                className={`oom-page-results__navigation_item ${selectedGroup === null ? 'active' : ''}`}
                                onClick={() => setSelectedGroup(null)} // Reset to show all keywords
                            >
                                <span className='keyword'>
                                    <KeyboardArrowRightIcon sx={{ fontSize: 24 }} />All
                                </span>
                                <span className='total'>{generatedKeywordIdeas.length}</span>
                            </div>
                            {Object.entries(groupedKeywords).map(([groupName, items], index) => (
                                <div
                                    key={index}
                                    className={`oom-page-results__navigation_item ${selectedGroup === groupName ? 'active' : ''}`}
                                    onClick={() => setSelectedGroup(selectedGroup === groupName ? null : groupName)}
                                >
                                    <span className='keyword'>
                                        <KeyboardArrowRightIcon sx={{ fontSize: 24 }} /> {groupName}
                                    </span>
                                    <span className='total'>{items.length}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='oom-page-results__details'>
                        <div className='oom-page-results__details_heading'>
                            <div className='oom-page-results__details_heading_fitler'>
                                <span>Filter</span>
                            </div>
                            <div className='oom-page-results__details_heading_button'>
                                <button onClick={handleAddToListModal} className='oom-button plain'><AddIcon sx={{ fontSize: 14 }} /> <span>Add to List</span></button>
                            </div>
                        </div>

                        <div className="oom-page-results__details_results">
                            <div className="oom-page-results__details_results_heading">
                                <span>{formatNumber(totalResults)} keywords ideas available</span>
                            </div>

                            <table className="oom-page-results__details_results_table">
                                <thead className="oom-page-results__details_results_table_heading">
                                    <tr>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-30">
                                            <span>Keywords</span>
                                        </th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-10 sortable"
                                            onClick={() => { setSortBy('searchVolume'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                                            <span>Search Volume <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                                        </th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-10 sortable"
                                            onClick={() => { setSortBy('searchVolume'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                                            <span>History <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                                        </th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-15 sortable"
                                            onClick={() => { setSortBy('cpcLow'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                                            <span>CPC (low range) <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                                        </th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-15 sortable"
                                            onClick={() => { setSortBy('cpcHigh'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                                            <span>CPC (high range) <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                                        </th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-20 sortable"
                                            onClick={() => { setSortBy('competition'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                                            <span>Competition <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="oom-page-results__details_results_items">
                                    {currentItems.map((keyword, index) => {
                                        const monthlySearchVolumes = keyword.keyword_idea_metrics?.monthly_search_volumes || [];
                                        return (
                                            <tr className='oom-page-results__details_results_table_item' key={index}>
                                                <td className='column-item oom-column-30'>
                                                    <div className="keyword-input">
                                                        <div className='keyword'>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedKeywords.includes(keyword.text)}
                                                                onChange={(e) => handleCheckboxChange(e, keyword.text)}
                                                            />
                                                            <span>{keyword.text}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='column-item oom-column-10'>
                                                    <div className='search-volume'>
                                                        <span>
                                                            {formatNumber(monthlySearchVolumes.slice(-1)[0]?.monthly_searches) || "..."}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='column-item oom-column-10'>
                                                    <div className='search-volume'>
                                                        {monthlySearchVolumes.length > 0 && (
                                                            <MonthlySearchChart
                                                                changeDisplay={false}
                                                                monthlySearchVolumes={monthlySearchVolumes}
                                                                onClick={() => handleOpenModal(monthlySearchVolumes)} // Pass data to modal
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className='column-item oom-column-15'>
                                                    <span>SGD {(keyword.keyword_idea_metrics?.low_top_of_page_bid_micros / 1000000 || 0).toFixed(2)}</span>
                                                </td>
                                                <td className='column-item oom-column-15'>
                                                    <span>SGD {(keyword.keyword_idea_metrics?.high_top_of_page_bid_micros / 1000000 || 0).toFixed(2)}</span>
                                                </td>
                                                <td className='column-item oom-column-20'>
                                                    <span>{keyword.keyword_idea_metrics?.competition || "N/A"}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className='oom-page-results__pagination'>
                                {CustomPagination(currentPage, totalPages, handlePageChange)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            <Dialog open={addToListModal} onClose={handleAddToListClose} maxWidth="sm" fullWidth>
                <DialogTitle>Save to Project</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="keyword-type-label">Keyword Type</InputLabel>
                        <Select
                            labelId="keyword-type-label"
                            value={selectedKeywordType}
                            onChange={handleKeywordTypeChange}
                            fullWidth
                        >
                            <MenuItem value="SEO">SEO</MenuItem>
                            <MenuItem value="Blog">Blog</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">
                        <InputLabel id="project-select-label">Select Project</InputLabel>
                        <Select
                            labelId="project-select-label"
                            value={selectedProject}
                            onChange={handleProjectChange}
                            fullWidth
                            disabled={loading} // Disable while loading
                        >
                            {loading ? (
                                <MenuItem disabled>
                                    <CircularProgress size={20} />
                                </MenuItem>
                            ) : projects.length > 0 ? (
                                projects.map((project) => (
                                    <MenuItem key={project._id} value={project._id}>
                                        {project.projectName}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No projects found</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddToListSave} color="secondary" className='oom-button oom-btn-loader action'>
                        <span className='text'>Save</span>
                    </Button>
                    <Button onClick={handleAddToListClose} color="secondary" className='oom-button oom-btn-loader action'>
                        <span className='text'>Cancel</span>
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
};