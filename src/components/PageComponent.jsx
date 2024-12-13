import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import SectionSideBarMenu from '../components/template/SectionSideBarMenu';
import PageController from '../controllers/PageController';
import LogoutButton from './widgets/LogoutButton';
import 'react-toastify/dist/ReactToastify.css'; 

import "../assets/css/Main.css";
import "../assets/css/Loader.css";

const menuLabels = {
    'dashboard': 'Dashboard',
    'projects': 'Projects',
    'research': 'Research',
    'website-audit': 'Website Audit',
    'content-generation': 'Content Generation',
    'reporting-insights': 'Reporting and Insights'
};

export default function DynamicPage() {
    const { page, subpage, id } = useParams();
    const PageContent = PageController.getPageContent(page, subpage, id);

    const [expanded, setExpanded] = useState(null);
    const [collapse, setCollapse] = useState(null);
    const [expandedMenu, setExpandedMenu] = useState(null);
    const [activeTitle, setActiveTitle] = useState(null);
    const [isActive, setIsActive] = useState(false);

    const handleMouseEnter = (menuName, title) => {
        setExpanded(true);
        setCollapse(true);
        setExpandedMenu(menuName);
        setActiveTitle(title);
    };

    const handleMouseLeave = () => {
        setExpanded(false);
        setCollapse(false);
        setExpandedMenu(null);
        setActiveTitle(null);
    };

    const toggleAccordion = () => {
        setIsActive((prevState) => !prevState);
    };

    return (
        <React.Fragment>
            <SectionSideBarMenu handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} expanded={expanded} toggleAccordion={toggleAccordion} expandedMenu={expandedMenu} activeTitle={activeTitle} menuLabels={menuLabels} isActive={isActive} />
            <section className={`oom-main-content-section ${collapse ? 'collapse' : ''}`}>
                 <ToastContainer
                    position="top-right"
                    autoClose={3000} 
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                <div className="oom-page-content">
                    <PageContent page={page} subpage={subpage} id={id} />
                </div>
                <LogoutButton />
            </section>
        </React.Fragment>
    )
}