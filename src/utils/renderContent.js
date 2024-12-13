/**
 * Renders content based on the provided data.
 *
 * This function takes in a data object (or array) and recursively renders the appropriate HTML elements based on the structure and type of the data. It handles rendering various HTML tags (like `<h2>`, `<h3>`, `<ul>`, `<table>`, etc.) and includes tooltips for certain headers. The function also handles the rendering of FAQ-style Q&A pairs.
 * 
 * @since 1.0.0
 * @version 1.0.0
 * 
 * @package ContentRenderer
 * 
 * @author OOm Developer (oom_ss)
 * 
 * @example
 * // Example data structure
 * const data = {
 *     "h2": "This is a heading",
 *     "p": "This is a paragraph",
 *     "ul": ["Item 1", "Item 2", "Item 3"]
 * };
 * 
 * // Render the content
 * renderContent(data);
 * 
 * @param {object | array | string} data - The data to be rendered, which can be an array, an object, or a string.
 * @returns {React.Element} JSX elements representing the rendered content.
 */

import React from 'react';
import { Tooltip } from 'react-tooltip';
import InfoIcon from '@mui/icons-material/Info';

export const renderContent = (data) => {
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
                        value.header && value.rows && (
                            <table border="1">
                                <thead>
                                    <tr>
                                        {value.header.map((header, index) => (
                                            <th key={index}>{header.Feature}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {value.rows.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <td key={cellIndex}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
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