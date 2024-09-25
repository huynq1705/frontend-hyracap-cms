interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  dir: string;
  [x: string]: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, dir, ...prop } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      dir={dir}
      {...prop}
    >
      {value === index && children}
    </div>
  );
}
export default TabPanel;
