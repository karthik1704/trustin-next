'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage.toString());
    router.push(`/dashboard/customers?${params.toString()}`);
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
      // containerClassName={'pagination'}
      // activeClassName={'active'}
      forcePage={page - 1}
      containerClassName={'flex justify-center mt-4 space-x-2'}
      pageClassName={'inline-block'}
      pageLinkClassName={'px-3 py-1 border border-gray-300 rounded hover:bg-gray-200'}
      previousClassName={'inline-block'}
      previousLinkClassName={'px-3 py-1 border border-gray-300 rounded hover:bg-gray-200'}
      nextClassName={'inline-block'}
      nextLinkClassName={'px-3 py-1 border border-gray-300 rounded hover:bg-gray-200'}
      breakLinkClassName={'px-3 py-1 border border-gray-300 rounded'}
      activeClassName={'bg-blue-500 text-white'}
    />
  );
};

export default Pagination;
