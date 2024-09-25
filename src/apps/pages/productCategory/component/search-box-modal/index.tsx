import React, { useState } from "react";
import styles from "@/assets/styles/search-box-table.module.scss";
import SearchNormal from "@/components/icons/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
import { KeySearchType } from "@/types/types";
export interface SearchBoxTableProps {
  keySearch: KeySearchType;
  setKeySearch: (value: { [x: string]: string }) => void;
  handleSearch: () => void;
  customCss?: string;
}
export default function SearchBoxTable(props: SearchBoxTableProps) {
  const { keySearch, setKeySearch, handleSearch, customCss } = props;
  const [flagOnSearch, setFlagOnSearch] = useState(false);
  return (
    <div className={styles.wrapper}>
      <p>Tìm kiếm nhanh</p>
      <Box
        className={`${styles.search_box} ${customCss && "!min-w-full"}`}
        sx={{
          "> svg": {
            cursor: "pointer",
            color: flagOnSearch ? "var(--text-color-primary)" : "#ccc",
          },
          border: flagOnSearch
            ? "1px solid var(--text-color-primary)"
            : " 1px solid var(--border-color-primary)",
        }}
        onClick={() => {
          setFlagOnSearch(true);
        }}
        onMouseLeave={() => {
          setFlagOnSearch(false);
        }}
      >
        <input
          value={keySearch?.name__like?.toString()}
          onChange={(e) => {
            setKeySearch({
              ...keySearch,
              name__like: e.target.value,
            });
          }}
          className={styles.input}
          placeholder="Tìm kiếm danh mục sản phẩm"
        />
        {keySearch?.name__like && (
          <Box
            component={"span"}
            sx={{
              "> svg": {
                cursor: "pointer",
              },
            }}
          >
            <FontAwesomeIcon
              icon={faCircleXmark}
              onClick={() => {
                setKeySearch({ ...keySearch, name__like: "" });
              }}
            />
          </Box>
        )}
        <span className={styles.line}></span>
        <SearchNormal onClick={handleSearch} />
      </Box>
    </div>
  );
}
