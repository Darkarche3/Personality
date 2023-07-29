import React, { Component } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

export class PaginationComponent extends Component {
  render() {
    let currentPage = this.props.currentPage;
    let pagesCount = this.props.pagesCount;
    return (
      <div className="pagination pagination-wrapper">
        <Pagination aria-label="Page navigation example">
          {currentPage >= 1 && (<PaginationItem>
            <PaginationLink
              onClick={e => this.props.handlePageClick(e, currentPage - 1)}
              href="#">
              &lsaquo;
            </PaginationLink>
          </PaginationItem>)}

          {[...Array(pagesCount)].map((page, i) => (
            <PaginationItem active={i === currentPage} key={i}>
              <PaginationLink
                onClick={e => this.props.handlePageClick(e, i)}
                href="#"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {(currentPage <= this.pagesCount - 2) && <PaginationItem>
            <PaginationLink
              onClick={e => this.props.handlePageClick(e, currentPage + 1)}
              next>
              &rsaquo;
            </PaginationLink>
          </PaginationItem>}
        </Pagination>
      </div>
    );
  }
}