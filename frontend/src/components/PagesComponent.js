import { useSelector } from 'react-redux';

import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

export default function PagesComponent({changePage, currentPage}) {
  const pages = useSelector((state) => state.pages);
  const pagesCount = Math.ceil(pages.total / 5);

  const pagesArr = [];
  for (let i = 0; i < pagesCount; i++) {
    pagesArr.push(i + 1);
  }

  return (
    <Pagination size="lg">
      {
        pagesArr.map(idx => 
          <PaginationItem key={idx} onClick={() => changePage(idx)} active={idx === currentPage}>
            <PaginationLink href="#">
              {idx}
            </PaginationLink>
          </PaginationItem>
        )
      }
    </Pagination>
  );
};
