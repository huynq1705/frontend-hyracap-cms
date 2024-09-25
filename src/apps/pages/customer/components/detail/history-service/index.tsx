import * as React from "react";
import { useParams } from "react-router-dom";
import TreatmentHistory from "./treatment";
import PrepaidHistory from "./prepaid";
import { useDispatch } from "react-redux";
import { setNavOpen } from "@/redux/slices/navigation.slice";
const NotFoundModule = React.lazy(() => import("@/apps/pages/NotFound"));
export interface HistoryServicePageProps {}

export default function HistoryServicePage(props: HistoryServicePageProps) {
  const { tag } = useParams();
    const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setNavOpen(false));
  }, []);
  if (tag == "history-service-treatment") return <TreatmentHistory />;
  if (tag == "history-service-prepaid") return <PrepaidHistory />;
  return <NotFoundModule />;
}
