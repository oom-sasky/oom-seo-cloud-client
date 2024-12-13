import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export default function CustomPagination(currentPage, totalPages, handlePageChange) {

    const buttons = [];

    buttons.push(
        <button key="left-arrow" className='pagination-item' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <KeyboardArrowLeftIcon sx={{ fontSize: 24 }} />
        </button>
    );

    if (currentPage > 3) {
        buttons.push(
            <button className='pagination-item' key={1} onClick={() => handlePageChange(1)}>
                1
            </button>,
            <button className='pagination-item' key={2} onClick={() => handlePageChange(2)}>
                2
            </button>,
            <span key="ellipsis-start">...</span>
        );
    }

    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
        buttons.push(
            <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={currentPage === i ? 'pagination-item active' : 'pagination-item'}
            >
                {i}
            </button>
        );
    }

    // Show last page with ellipsis if currentPage is not near the end
    if (currentPage < totalPages - 2) {
        buttons.push(
            <span key="ellipsis-end">...</span>,
            <button className='pagination-item' key={totalPages} onClick={() => handlePageChange(totalPages)}>
                {totalPages}
            </button>
        );
    }

    buttons.push(
        <button key="right-arrow" className='pagination-item' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
             <KeyboardArrowRightIcon sx={{ fontSize: 24 }} />
        </button>
    );

    return buttons;
};
