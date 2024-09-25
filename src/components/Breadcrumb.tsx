import React from "react";
import { NavLink } from "react-router-dom";

import { styled, useTheme, Theme } from "@mui/system";
import { Icon, Breadcrumbs } from "@mui/material";

interface RouteSegment {
  path: string;
  name: string;
}

interface BreadcrumbProps {
  routeSegments: RouteSegment[];
  homePath?: string;
}

const BreadcrumbRoot = styled("div")(() => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
}));

const SubName = styled("span")(({ theme }: { theme: Theme }) => ({
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
}));

const StyledIcon = styled(Icon)(() => ({
  marginLeft: 8,
  marginBottom: "4px",
  verticalAlign: "middle",
}));

const Breadcrumb= (props: BreadcrumbProps) => {
  const { routeSegments, homePath } = props;
  const theme = useTheme();
  const hint = theme.palette.text.hint;

  return (
    <BreadcrumbRoot>
      <Breadcrumbs
        separator={<Icon sx={{ color: hint }}>navigate_next</Icon>}
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <NavLink to={homePath || "/"}>
          <StyledIcon color="primary">home</StyledIcon>
        </NavLink>
        {routeSegments
          ? routeSegments.map((route, index) => {
              return index !== routeSegments.length - 1 ? (
                <NavLink key={index} to={route.path}>
                  <SubName>{route.name}</SubName>
                </NavLink>
              ) : (
                <SubName key={index}>{route.name}</SubName>
              );
            })
          : null}
      </Breadcrumbs>
    </BreadcrumbRoot>
  );
};

export default Breadcrumb;
