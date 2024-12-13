
/**
 * Page Controller
 *
 * This controller handles the logic for retrieving and displaying different pages in the application. 
 * Based on the input parameters (`page`, `subpage`, and `id`), it returns the appropriate component for rendering.
 *
 * @since 1.0.0
 * @version 1.0.0
 * 
 * @package OOmAISEOTools
 * @package page-controller 
 * 
 * @author  OOm Developer (oom_ss)
 */

import Dashboard from '../views/Dashboard';
import Projects from '../views/Projects/Projects';
import AuditPage from '../views/Audit/AuditPage';
import AuditResults from '../views/Audit/AuditResults';
import Traffic from '../views/AnalyticsTraffic/Traffic';
import ContentGeneration from '../views/AiGeneration/ContentGeneration';
import ContentsGeneration from '../views/AiGeneration/ContentsGeneration';
import KeywordResearch from '../views/Research/KeywordResearch';
import KeywordIdeas from '../views/Research/KeywordIdeas';
import CompetitorComparison from '../views/Research/CompetitorComparison';
import NotFound from '../views/NotFound';

const PageController = {
  getPageContent: (page, subpage, id) => {
    switch (page) {
      case 'dashboard':
        return Dashboard;
      case 'projects':
        return Projects;
      case 'analytics-traffic':
        if (id && subpage && subpage === 'traffic') {
            return Traffic;
        }
        return NotFound;
      case 'audit':
        if (id === 'new') {
          return AuditPage;
        } else if (id && subpage && subpage === 'results') {
          return AuditResults;
        }
        break;
      case 'ai-generation':
        if(id === 'contents') {
          return ContentsGeneration;
        } else {
          return ContentGeneration;
        }
      case 'research':
        if (id === 'keyword-research') {
          return KeywordResearch;
        } else if (id === 'keyword-ideas') {
          return KeywordIdeas;
        } else if (id === 'competitor-comparison') {
          return CompetitorComparison;
        } else {
          return NotFound;
        }
      default:
        return NotFound;
    }
  },
};

export default PageController;
