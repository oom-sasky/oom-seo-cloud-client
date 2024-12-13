import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthHeaders } from '../../context/AuthContext';
import useGeoTargetConstants from '../../hooks/useGeoTargetConstants';
import useProjects from '../../hooks/useProjects';
import { toast } from 'react-toastify';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import CustomSelect from '../../components/widgets/CustomSelect';
import MonthlySearchChart from '../../components/widgets/MonthlySearchChart';
import CustomPagination from '../../components/widgets/CustomPagination';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { formatNumber } from '../../utils/formatNumber';
import "../../assets/css/Loader.css";
import "../../assets/css/CompetitorComparison.css";

export default function CompetitorComparison() {
  const headers = useAuthHeaders();
  const { geoTargetData } = useGeoTargetConstants(headers);
  const { projects } = useProjects(headers);

  const [loading, setLoading] = useState(false);
  const [generatedKeywordIdeas, setGeneratedKeywordIdeas] = useState([]);
  const [clientURL, setClientURL] = useState('');
  const [competitorURLs, setCompetitorURLs] = useState([""]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [commonKeywords, setCommonKeywords] = useState([]);
  const [uniqueKeywords, setUniqueKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedKeywordType, setSelectedKeywordType] = useState("");
  const [addToListModal, setAddToListModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const [selectedChartData, setSelectedChartData] = useState(null);
  const [monthlySearchVolumesModal, setMonthlySearchVolumesModal] = useState(false);

  const [sortBy, setSortBy] = useState('searchVolume');
  const [sortOrder, setSortOrder] = useState('asc');

  const getCurrentKeywords = () => {
    let keywords = [];

    switch (selectedTab) {
      case 'all':
        keywords = generatedKeywordIdeas;
        break;
      case 'common':
        keywords = commonKeywords;
        break;
      case 'unique':
        keywords = uniqueKeywords;
        break;
      case 'missing':
        keywords = missingKeywords;
        break;
      default:
        keywords = [];
    }

    // Sorting keywords
    if (keywords.length > 0) {
      if (sortBy === 'keyword') {
        // Sort alphabetically by keyword (case insensitive)
        keywords = [...keywords].sort((a, b) => {
          const aText = a.text.toLowerCase();
          const bText = b.text.toLowerCase();
          return sortOrder === 'desc' ? bText.localeCompare(aText) : aText.localeCompare(bText);
        });
      } else if (sortBy === 'searchVolume') {
        // Sorting by search volume (numerically)
        keywords = [...keywords].sort((a, b) => {
          const aVolume = a.monthly_search_volumes.slice(-1)[0]?.monthly_searches || 0;
          const bVolume = b.monthly_search_volumes.slice(-1)[0]?.monthly_searches || 0;
          return sortOrder === 'desc' ? bVolume - aVolume : aVolume - bVolume;
        });
      } else if (sortBy === 'competition') {
        // Sorting by competition index (numerically)
        keywords = [...keywords].sort((a, b) => {
          const aCompetition = a.competition_index || 0;
          const bCompetition = b.competition_index || 0;
          return sortOrder === 'desc' ? bCompetition - aCompetition : aCompetition - bCompetition;
        });
      } else if (sortBy === 'cpcLow') {
        // Sorting by CPC (low range)
        keywords = [...keywords].sort((a, b) => {
          const aCpcLow = a.low_top_of_page_bid_micros / 1000000 || 0;
          const bCpcLow = b.low_top_of_page_bid_micros / 1000000 || 0;
          return sortOrder === 'desc' ? bCpcLow - aCpcLow : aCpcLow - bCpcLow;
        });
      } else if (sortBy === 'cpcHigh') {
        // Sorting by CPC (high range)
        keywords = [...keywords].sort((a, b) => {
          const aCpcHigh = a.high_top_of_page_bid_micros / 1000000 || 0;
          const bCpcHigh = b.high_top_of_page_bid_micros / 1000000 || 0;
          return sortOrder === 'desc' ? bCpcHigh - aCpcHigh : aCpcHigh - bCpcHigh;
        });
      }
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    return keywords.slice(startIndex, startIndex + itemsPerPage);
  };

  const getTabKeywordsCount = () => {
    switch (selectedTab) {
      case 'all': return generatedKeywordIdeas.length;
      case 'common': return commonKeywords.length;
      case 'unique': return uniqueKeywords.length;
      case 'missing': return missingKeywords.length;
      default: return 0;
    }
  };

  useEffect(() => {
    if (geoTargetData) {
      const singapore = geoTargetData.find(country => country.label === "Singapore");
      if (singapore) {
        setSelectedCountries([{ label: singapore.label, value: singapore.value }]);
      }
    }
  }, [geoTargetData]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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

  const handleKeywordTypeChange = (e) => {
    setSelectedKeywordType(e.target.value);
  };

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
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

  const handleCountrySelect = (selectedItems) => {
    const newSelectedCountries = selectedItems.filter(item =>
      !selectedCountries.some(selected => selected.value === item.value)
    );
    setSelectedCountries([...selectedCountries, ...newSelectedCountries]);
  };

  const handleCountryRemove = (countryToRemove) => {
    setSelectedCountries(selectedCountries.filter(country => country.value !== countryToRemove.value));
  };

  const addInputUrlField = () => {
    setCompetitorURLs([...competitorURLs, ""]);
  };

  const handleClientUrlChange = (event) => {
    setClientURL(event.target.value);
  };

  const handleUrlChange = (index, event) => {
    const updatedURLs = [...competitorURLs];
    updatedURLs[index] = event.target.value;
    setCompetitorURLs(updatedURLs);
  };

  const removeInputUrlField = (index) => {
    const updatedURLs = competitorURLs.filter((_, i) => i !== index);
    setCompetitorURLs(updatedURLs);
  };

  const handleOpenModal = (data) => {
    setSelectedChartData(data);
    setMonthlySearchVolumesModal(true);
  };

  const handleCloseModal = () => {
    setMonthlySearchVolumesModal(false);
    setSelectedChartData(null);
  };

  const handleCompetitorAnalyze = async () => {
    if (clientURL.length === 0) {
      toast.error("Please enter client URL");
      return;
    }

    if (selectedCountries.length === 0) {
      toast.error("Please select at least one country for analysis");
      return;
    }

    const validUrls = competitorURLs.filter(url => url.trim() !== "");
    if (validUrls.length < 1) {
      toast.error("Please enter at least one competitor site URL");
      return;
    }


    if (competitorURLs.length > 5) {
      toast.error("Maximum 5 Competitors URL only");
      return;
    }

    setLoading(true);

    try {
      const endPointCompetitorKeywordIdeas = process.env.REACT_APP_OOM_SEO_API_COMPETITOR_KEYWORD_IDEAS;
      const response = await axios.get(
        `${endPointCompetitorKeywordIdeas}`,
        {
          params: {
            locations: selectedCountries.map(country => country.value).join(','),
            client_url: clientURL,
            competitor_urls: competitorURLs.join(',')
          },
          headers,
        }
      );

      if (response.data.status === 200) {
        const clientKeywordIdeas = response.data.client_keyword_ideas;
        const competitorKeywordIdeas = response.data.competitor_keywords_ideas;

        // Function to extract all data from keywords
        const getKeywordsWithData = (keywordIdeas) => {
          return Object.values(keywordIdeas).flat().map(keyword => {
            const keywordMetrics = keyword.keyword_idea_metrics || {};
            return {
              text: keyword.text.toLowerCase(),
              monthly_search_volumes: keywordMetrics.monthly_search_volumes || [],
              competition: keywordMetrics.competition || 'N/A',
              avg_monthly_searches: keywordMetrics.avg_monthly_searches || 'N/A',
              competition_index: keywordMetrics.competition_index || 'N/A',
              low_top_of_page_bid_micros: keywordMetrics.low_top_of_page_bid_micros || 'N/A',
              high_top_of_page_bid_micros: keywordMetrics.high_top_of_page_bid_micros || 'N/A',
            };
          });
        };

        // Get all keywords with their additional data
        const allKeywordsWithData = [
          ...getKeywordsWithData(clientKeywordIdeas),
          ...getKeywordsWithData(competitorKeywordIdeas),
        ];

        // Extract unique keywords based on the 'text' field
        // const allKeywords = [...new Set(allKeywordsWithData.map(keyword => keyword.text))];

        // Store the full data in state
        setGeneratedKeywordIdeas(allKeywordsWithData);

        // Separate client and competitor keywords with full data
        const clientKeywordsWithData = getKeywordsWithData(clientKeywordIdeas);
        const competitorKeywordsWithData = getKeywordsWithData(competitorKeywordIdeas);

        // Filter out common and missing keywords based on text (ignoring case)
        const commonKeywords = clientKeywordsWithData.filter(clientKeyword =>
          competitorKeywordsWithData.some(competitorKeyword =>
            competitorKeyword.text === clientKeyword.text
          )
        );
        setCommonKeywords(commonKeywords); // Store full keyword data

        const missingKeywords = competitorKeywordsWithData.filter(competitorKeyword =>
          !clientKeywordsWithData.some(clientKeyword => clientKeyword.text === competitorKeyword.text)
        );
        setMissingKeywords(missingKeywords); // Store full keyword data

        const uniqueClientKeywords = clientKeywordsWithData.filter(clientKeyword =>
          !competitorKeywordsWithData.some(competitorKeyword => competitorKeyword.text === clientKeyword.text)
        );
        setUniqueKeywords(uniqueClientKeywords); // Store full keyword data
      }
    } catch (error) {
      console.error('Error generating keyword ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    setCurrentPage(1);
  };

  return (
    <React.Fragment>
      <div className="oom-page-attributes breadcrumb keyword-research">
        <p className="oom-page-attributes_breadcrumb">Research / <span className="highlight">Competitor Comparison</span></p>
        <p className="oom-page-attributes_title">Competitor Comparison <span className="highlight">/ Company A</span></p>
      </div>

      {clientURL && (
        <div className='oom-page-sub-attributes website'>
          <span>Client URL:</span>
          <span className="keywords"><ul><li>{clientURL}</li></ul></span>
          <span>Competitor URLs:</span>
          <span className="keywords">
            <ul>
              {competitorURLs.filter(url => url.trim() !== '').length > 0 && (
                <span className="keywords">
                  <ul>
                    {competitorURLs
                      .filter(url => url.trim() !== '')
                      .map((url, index) => (
                        <li key={index}>{url}</li>
                      ))}
                  </ul>
                </span>
              )}
            </ul>
          </span>
        </div>
      )}

      <div className="oom-form">
        <div className="oom-form_list_container">
          <div className="oom-field-container">
            <input
              type="url"
              className="oom-field"
              placeholder="https://"
              value={clientURL}
              disabled={loading}
              onChange={handleClientUrlChange}
            />
          </div>
          <div className="oom-field-container oom-custom-select-container">
            <CustomSelect
              options={geoTargetData ? geoTargetData.map(country => ({ label: country.label, value: country.value })) : []}
              selectedItems={selectedCountries}
              onSelect={handleCountrySelect}
              onRemove={handleCountryRemove}
              multiSelect={true}
              disabled={loading}
              placeholder={"Select Location"}
            />
          </div>
          <div className="oom-field-container oom-competitor-urls-container">
            {competitorURLs.map((url, index) => (
              <div className='oom-competitor-url-item' key={index}>
                <input
                  type="url"
                  className="oom-field"
                  placeholder="https://"
                  value={url}
                  disabled={loading}
                  onChange={(event) => handleUrlChange(index, event)}
                />
                {index !== 0 ? (
                  <button type='button' className='oom-button add-remove-btn' onClick={() => removeInputUrlField(index)} disabled={competitorURLs.length === 1 || loading} >
                    <RemoveIcon sx={{ fontSize: 14 }} />
                  </button>
                ) : (
                  <button type="button" className="oom-button add-remove-btn" onClick={addInputUrlField} disabled={loading} >
                    <AddIcon sx={{ fontSize: 14 }} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className='oom-field-container__row flex-direction-row'>
            <button title="Analyze" onClick={handleCompetitorAnalyze} className="oom-button oom-btn-loader action">
              <span className="text">Analyze</span>
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="ai-loader">
          <span></span><span></span><span></span><span></span>
        </div>
      )}

      <div className="oom-page-results keyword-ideas-analysis">
        <div className="oom-tabs">
          <button
            className={`oom-tab-item ${selectedTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All
          </button>
          <button
            className={`oom-tab-item ${selectedTab === 'common' ? 'active' : ''}`}
            onClick={() => handleTabChange('common')}
          >
            Common Keywords
          </button>
          <button
            className={`oom-tab-item  ${selectedTab === 'unique' ? 'active' : ''}`}
            onClick={() => handleTabChange('unique')}
          >
            Unique Keywords
          </button>
          <button
            className={`oom-tab-item  ${selectedTab === 'missing' ? 'active' : ''}`}
            onClick={() => handleTabChange('missing')}
          >
            Missing Keywords
          </button>
        </div>

        {getTabKeywordsCount() > 0 && (
          <div className="oom-page-results__details">
            <div className="oom-page-results__details_heading">
              <div className="oom-page-results__details_heading_fitler"></div>
              <div className="oom-page-results__details_heading_button">
                <button onClick={handleAddToListModal} className='oom-button plain'><AddIcon sx={{ fontSize: 14 }} /> <span>Add to List</span></button>
              </div>
            </div>

            <div className="oom-page-results__details_results">
              <div className="oom-page-results__details_results_heading">
                <span>{formatNumber(getTabKeywordsCount())} keywords ideas available</span>
              </div>

              <table className='oom-page-results__details_results_table'>
                <thead className='oom-page-results__details_results_table_heading'>
                  <tr>
                    <th className='oom-page-results__details_results_table_heading_item oom-column-30 sortable'
                      onClick={() => { setSortBy('keyword'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                      <span>Keywords <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                    </th>
                    <th className='oom-page-results__details_results_table_heading_item oom-column-10 sortable'
                      onClick={() => { setSortBy('searchVolume'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                      <span>Search Volume <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                    </th>
                    <th className='oom-page-results__details_results_table_heading_item oom-column-10 sortable'
                      onClick={() => { setSortBy('searchVolume'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                      <span>History <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                    </th>
                    <th className='oom-page-results__details_results_table_heading_item oom-column-15 sortable'
                      onClick={() => { setSortBy('cpcLow'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                      <span>CPC (low range) <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                    </th>
                    <th className='oom-page-results__details_results_table_heading_item oom-column-15 sortable'
                      onClick={() => { setSortBy('cpcHigh'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                      <span>CPC (high range) <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                    </th>
                    <th className='oom-page-results__details_results_table_heading_item oom-column-20 sortable'
                      onClick={() => { setSortBy('competition'); setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); }}>
                      <span>Competition <ImportExportIcon sx={{ fontSize: 20 }} /></span>
                    </th>
                  </tr>
                </thead>
                <tbody className='oom-page-results__details_results_items'>
                  {getCurrentKeywords().map((keyword, index) => {
                    const monthlySearchVolumes = keyword.monthly_search_volumes || [];
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
                          <span>SGD {(keyword.low_top_of_page_bid_micros / 1000000 || 0).toFixed(2)}</span>
                        </td>
                        <td className='column-item oom-column-15'>
                          <span>SGD {(keyword.high_top_of_page_bid_micros / 1000000 || 0).toFixed(2)}</span>
                        </td>
                        <td className='column-item oom-column-20'>
                          <span>{keyword.competition || "N/A"}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className='oom-page-results__pagination'>
                {getTabKeywordsCount() > 0 && CustomPagination(currentPage, itemsPerPage, handlePageChange)}
              </div>
            </div>
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
          <Button onClick={handleCloseModal} color="primary" className=''>
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
}
