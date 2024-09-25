import React, { useState } from "react";
import styles from "@/assets/styles/search-box-table.module.scss";
import SearchNormal from "@/components/icons/search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/material";
export interface SearchBoxTableProps {
  keySearch?: string;
  // setKeySearch: (value: { [x: string]: string }) => void;
  setKeySearch: (value?: string) => void;
  handleSearch: () => void;
  placeholder?: string;
}

export default function SearchBoxTable(props: SearchBoxTableProps) {
  const { keySearch, setKeySearch, handleSearch, placeholder } = props;
  const [flagOnSearch, setFlagOnSearch] = useState(false);
  return (
    <div className={styles.wrapper}>
      <p>Tìm kiếm nhanh</p>
      <Box
        className={styles.search_box}
        sx={{
          "> svg": {
            cursor: "pointer",
            color: flagOnSearch ? "var(--text-color-primary)" : "#ccc",
          },
          border: flagOnSearch
            ? "1px solid var(--text-color-primary)"
            : " 1px solid var(--border-color-primary)",
          my: 1,
        }}
        onClick={() => {
          setFlagOnSearch(true);
        }}
        onMouseLeave={() => {
          setFlagOnSearch(false);
        }}
      >
        <input
          value={keySearch || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
          onChange={(e) => {
            setKeySearch(e.target.value);
          }}
          className={styles.input}
          placeholder={placeholder}


        />
        {keySearch && (
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
                setKeySearch("");
              }}
            />
          </Box>
        )}
        <span className={styles.line}></span>
        <SearchNormal
          onClick={() => {
            handleSearch();
          }}
        />
      </Box>
    </div>
  );
}
