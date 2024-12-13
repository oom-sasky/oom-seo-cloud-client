import React from 'react';
const expandCollapseImage = '/assets/img/expand-collapse-icon-min.png';
const dashboardIcon = '/assets/img/dashboard-min.png';
const projectsIcon = '/assets/img/project-min.png';
const keywordPlannerIcon = '/assets/img/keyword-planner-min.png';
const webAuditIcon = '/assets/img/website-audit-min.png';
const contentGeneration = '/assets/img/content-generation-min.png';
const reportsAuditIcon = '/assets/img/reporting-insights-min.png';
const notificationsIcon = '/assets/img/notifications-min.png';
const settingsIcon = '/assets/img/settings-min.png';
const profileIcon = '/assets/img/profile-min.png';
const chevronIcon = '/assets/img/chevron-down-min.png';

export default function SideBarMenu({ handleMouseEnter, handleMouseLeave, toggleAccordion, expanded, expandedMenu, activeTitle, menuLabels, isActive }) {
    return (
        <section className={`oom-global-menu-section ${expanded ? 'expand' : ''}`} onMouseLeave={handleMouseLeave}>
            <img className="oom-expand-collapse-icon" src={expandCollapseImage} alt="Expand/Collapse" />

            <div className="oom-collapse-menu">
                <span className="oom-collapse-menu_company">OOm</span>

                <div className="oom-collapse-menu_options">
                    {['dashboard', 'projects', 'research', 'website-audit', 'content-generation', 'reporting-insights'].map(menuName => (
                        <div
                            key={menuName}
                            className="oom-collapse-menu_option"
                            onMouseEnter={() => handleMouseEnter(menuName, menuName)}
                            data-menu={menuName}
                        >
                            <img
                                src={
                                    menuName === 'dashboard' ? dashboardIcon :
                                        menuName === 'projects' ? projectsIcon :
                                            menuName === 'research' ? keywordPlannerIcon :
                                                menuName === 'website-audit' ? webAuditIcon :
                                                menuName === 'content-generation' ? contentGeneration :
                                                    reportsAuditIcon
                                }
                                className="oom-collapse-menu_option-icon"
                                alt={menuLabels[menuName]}
                            />
                            <span
                                className="oom-collapse-menu_option-title"
                                style={{ display: activeTitle === menuName ? 'block' : 'none' }}
                            >
                                {menuLabels[menuName]}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="oom-collapse-menu_links">
                    {[notificationsIcon, settingsIcon, profileIcon].map((icon, index) => (
                        <a href="/" key={index} className="oom-collapse-menu_link">
                            <img
                                src={icon}
                                className="oom-collapse-menu_link-icon"
                                alt=""
                            />
                        </a>
                    ))}
                </div>
            </div>

            <div className="oom-expanded-menu">
                {['dashboard', 'projects', 'research', 'website-audit', 'content-generation', 'reporting-insights'].map(menuName => (
                    <div
                        key={menuName}
                        className={`oom-expanded-menu_option ${menuName}`}
                        style={{ display: expandedMenu === menuName ? 'flex' : 'none' }}
                    >
                        <p className="oom-expanded-menu_option_type">{menuLabels[menuName]}</p>

                        <div className="oom-expanded-menu_option_accordion">
                            <div
                                className={`oom-expanded-menu_option_accordion-header ${isActive ? 'active' : ''}`}
                                onClick={toggleAccordion}
                            >
                                <img
                                    className="oom-expanded-menu_option_accordion-header_icon"
                                    src={
                                        menuName === 'dashboard' ? dashboardIcon :
                                            menuName === 'projects' ? projectsIcon :
                                                menuName === 'research' ? keywordPlannerIcon :
                                                    menuName === 'website-audit' ? webAuditIcon :
                                                    menuName === 'content-generation' ? contentGeneration :
                                                        reportsAuditIcon
                                    }
                                    alt={menuLabels[menuName]}
                                />
                                <span className="oom-expanded-menu_option_accordion-header_title">
                                    {menuLabels[menuName]}
                                </span>
                                <img
                                    className="oom-expanded-menu_option_accordion-header_arrow"
                                    src={chevronIcon}
                                    alt="Arrow Icon"
                                />
                            </div>

                            <div className={`oom-expanded-menu_option_accordion-content ${isActive ? 'active' : ''}`}>
                                <div className="oom-expanded-menu_option_accordion-links">
                                    {menuName === 'dashboard' && (
                                        <a className="oom-expanded-menu_option_accordion-link" href="/dashboard">Overview</a>
                                    )}
                                    {menuName === 'projects' && (
                                        <>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/projects/">All Projects</a>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/projects/new/">Create Project</a>
                                        </>
                                    )}
                                    {menuName === 'research' && (
                                        <>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/research/keyword-research/">Keyword Research</a>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/research/competitor-comparison">Competitor Comparison</a>
                                        </>
                                    )}
                                    {menuName === 'website-audit' && (
                                        <>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/audit/new/">New Audit</a>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/">Overview</a>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/">Issue Report</a>
                                        </>
                                    )}
                                    {menuName === 'content-generation' && (
                                        <>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/ai-generation/new/">Create New Content</a>
                                        </>
                                    )}
                                    {menuName === 'reporting-insights' && (
                                        <>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/">Overview</a>
                                            <a className="oom-expanded-menu_option_accordion-link" href="/">Report</a>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
