import React from "react";
import { Pagination, PaginationProps } from "antd";
import { useSearchParams } from "react-router-dom";
import { handleGetPage } from "@/utils/filter";
import { useSelector } from "react-redux";
import { selectPage } from "@/redux/selectors/page.slice";

export interface CPaginationProps {}

export default function CPagination(props: CPaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const { currentPage, pageSize } = handleGetPage(searchParams);
  const page = useSelector(selectPage);
  const onChangePage: PaginationProps["onChange"] = (pageNumber: number) => {
    searchParams.set("page", pageNumber.toString());
    setSearchParams(searchParams);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize,
  ) => {
    searchParams.set("take", pageSize.toString());
    setSearchParams(searchParams);
  };
  const showTotal = (total: number, range: [number, number]) => {
    const isMobile = window.innerWidth <= 600;

    return (
      <div className="overflow-x-hidden">
        {isMobile
          ? `Hiển thị ${range[0]}-${range[1]}`
          : `Hiển thị ${range[0]}-${range[1]} của ${total} mục`}
      </div>
    );
  };
  if (!page.totalItems) return <div></div>;
  return (
    <Pagination
      className="custom-pagination"
      pageSize={pageSize}
      current={currentPage}
      showQuickJumper
      defaultCurrent={10}
      showSizeChanger
      showLessItems
      locale={{
        items_per_page: "bản ghi/trang",
        jump_to: "Đến",
        page: "trang",
      }}
      onShowSizeChange={onShowSizeChange}
      total={page.totalItems}
      onChange={onChangePage}
      showTotal={showTotal}
    />
  );
}
