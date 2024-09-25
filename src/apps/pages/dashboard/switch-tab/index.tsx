import React, { memo } from "react";
import { Tabs } from "antd";
interface SwitchTabsProps {
  data: {
    key: string;
    value: string;
  }[];
  onSwitch: (key: string) => void;
  value: string;
}
const SwitchTabs = (props: SwitchTabsProps) => {
  const { data, onSwitch, value } = props;
  return (
    <Tabs
      onChange={onSwitch}
      type="card"
      activeKey={value}
      items={data.map((_, i) => {
        const { key, value } = _;
        return {
          label: `${value}`,
          key: key,
          // children: value,
        };
      })}
    />
  );
};

export default memo(SwitchTabs);
