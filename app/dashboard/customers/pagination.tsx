import React from 'react';
import { useRouter } from 'next/router';
import ReactPaginate from 'react-paginate';

interface PaginationProps {
  total: number;
  page: number;
  size: number;
}

const Pagination: React.FC<PaginationProps> = ({ total, page, size }) => {
  const router = useRouter();
  const totalPages = Math.ceil(total / size);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const newPage = selectedItem.selected + 1;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage.toString() },
    });
  };

  return (
    <ReactPaginate
      previousLabel={'Previous'}
      nextLabel={'Next'}
      breakLabel={'...'}
      breakClassName={'break-me'}
      pageCount={totalPages}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageChange}
      containerClassName={'pagination'}
      activeClassName={'active'}
      forcePage={page - 1}
    />
  );
};

export default Pagination;
