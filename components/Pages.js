import React from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export const Pages = (props) => {
  return (
    <div className="pagination pagination-wrapper">
      <Pagination aria-label="Page navigation example">
        <PaginationItem disabled={props.currentPage <= 0}>
          <PaginationLink
            onClick={e => props.handlePageClick(e, props.currentPage - 1)}
            previous
            href="#"
          />
        </PaginationItem>

        {[...Array(props.pagesCount)].map((page, i) => (
          <PaginationItem active={i === props.currentPage} key={i}>
            <PaginationLink
              onClick={e => props.handlePageClick(e, i)}
              href="#"
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem disabled={props.currentPage >= props.pagesCount - 1}>
          <PaginationLink
            onClick={e => props.handlePageClick(e, props.currentPage + 1)}
            next
            href="#"
          />
        </PaginationItem>
      </Pagination>
    </div>
  );
}