import { areValidImageLinks } from "@/utils/validate-image";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { Avatar, Carousel } from "antd";

const DATA = [
  [
    { id: 1, name: "Đặng Thị Thu Hà", image: "" },
    { id: 2, name: "Nguyễn Thị Ánh Dương", image: "" },
    { id: 3, name: "Nguyễn Minh An", image: "" },
    { id: 4, name: "Phạm Khánh Linh", image: "" },
    { id: 5, name: "Nguyễn Thu Phương", image: "" },
  ],
  [
    { id: 1, name: "Đặng Thị Thu Hà", image: "" },
    { id: 2, name: "Nguyễn Thị Ánh Dương", image: "" },
    { id: 3, name: "Nguyễn Minh An", image: "" },
    { id: 4, name: "Phạm Khánh Linh", image: "" },
    { id: 5, name: "Nguyễn Thu Phương", image: "" },
  ],
  [
    { id: 1, name: "Đặng Thị Thu Hà", image: "" },
    { id: 2, name: "Nguyễn Thị Ánh Dương", image: "" },
    { id: 3, name: "Nguyễn Minh An", image: "" },
    { id: 4, name: "Phạm Khánh Linh", image: "" },
    { id: 5, name: "Nguyễn Thu Phương", image: "" },
  ],
];

export interface ListStaffProps {
  data: any[];
  ids: any[];
  setIDS: (value: any[]) => void;
}

export default function ListStaff(props: ListStaffProps) {
  const { data, ids, setIDS } = props;
  function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  const convert_data: any[][] = chunkArray(
    data,
    window.innerWidth < 1024 ? 2 : 5,
  );
  const style = {
    border: "1px solid var(--text-color-primary)",
    width: `calc(${window.innerWidth < 1024 ? 50 : 20}% - 8px)`,
    background: "#F6FAF7",
  };
  const handlePicEmployee = (id: any) => {
    const new_ids = [id];
    setIDS(new_ids);
  };
  const note = data.find((x) => ids.includes(x.value))?.note;
  return (
    <div className="w-full">
      <label className="label">
        {"Nhân viên thực hiện"}{" "}
        {true && <span style={{ color: "red" }}>(*)</span>}
      </label>
      <div>
        <Carousel
          arrows={true}
          dots={false}
          className="flex items-center custom-carousel"
        >
          {convert_data.map((staff, index) => (
            <div
              className="!w-[88%] mx-auto !flex flex-row p-4 gap-2 max-md:!w-[90%] justify-between"
              key={"staff -" + index}
            >
              {staff.map((x, index) => (
                <Box
                  className="flex flex-col items-center rounded-xl p-4 cursor-pointer transition-all"
                  sx={
                    ids.includes(x.value)
                      ? style
                      : {
                          width: `calc(${
                            window.innerWidth < 1024 ? 50 : 20
                          }% - 8px)`,
                          border: "1px solid transparent",
                        }
                  }
                  onClick={() => {
                    handlePicEmployee(x.value);
                  }}
                >
                  <Avatar
                    size={64}
                    icon={
                      x?.image && areValidImageLinks(x.image) ? (
                        <img src={x.image} />
                      ) : (
                        <FontAwesomeIcon icon={faUser} />
                      )
                    }
                  />
                  <b className="text-center text-sm mt-4">{x.label}</b>
                </Box>
              ))}
            </div>
          ))}
        </Carousel>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: note,
        }}
      />
    </div>
  );
}
