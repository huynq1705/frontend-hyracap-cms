import React from "react";

export interface ReportPageProps {}

export default function ReportPage(props: ReportPageProps) {
  const { pathname } = location;
  return <div>{pathname}</div>;
}
