import useCustomTranslation from "@/hooks/useCustomTranslation";
import Path from "@/utils/path";
import { Button } from "@mui/material";
import React from "react";
import { useNavigate, useRouteError } from "react-router-dom";
const CErrorBoundaryComponent = ({}): JSX.Element => {
  const { T } = useCustomTranslation();
  const navigate = useNavigate();
  const navigateHome = () => {
    navigate("/admin");
  };
  let error = useRouteError() || "";
  console.error(error);
  return (
    <div className="w-full text-center">
      <div className="flex items-center justify-center">
        <div className=" w-[200px]">
          <img
            className="w-full aspect-square object-cover"
            src={Path.get(`../../assets/images/error.png`)}
          />
        </div>
      </div>
      <div className="text-black font-medium text-[30px]  mt-5">
        {T("something_went_wrong")}.
      </div>
      <div className="text-black text-[15px] mb-4">{T("please_go_back")}.</div>
      <Button
        color="primary"
        onClick={navigateHome}
        className="!bg-gradient-to-br from-gradient_2 to-gradient_1 !text-white hover:to-gradient_2 border-none truncate"
      >
        {T("go_home")}
      </Button>
    </div>
  );
};

const CErrorBoundary = React.memo(CErrorBoundaryComponent);
export default CErrorBoundary;
