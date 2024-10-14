import { useNavigate } from "react-router-dom";
import BrandButton from "./BrandButton";

interface Tab {
  name: string;
  path: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: Tab) => {
    onTabChange(tab.name);
    navigate(tab.path);
  };

  return (
    <nav className="flex">
      {tabs.map((tab) => (
        <BrandButton
          key={tab.name}
          variant="primary"
          onClick={() => handleTabClick(tab)}
          active={activeTab === tab.name}
        >
          {tab.name}
        </BrandButton>
      ))}
    </nav>
  );
};

export default Tabs;
