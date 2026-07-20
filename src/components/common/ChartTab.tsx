import { Tabs, TabsList, TabsTrigger } from "../ui/tabs/Tabs";

interface ChartTabProps {
  onTabChange?: (tab: string) => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ onTabChange }) => {
  return (
    <Tabs 
      defaultValue="optionOne" 
      className="w-full"
      onValueChange={(value) => onTabChange?.(value)}
    >
      <TabsList className="w-full flex">
        <TabsTrigger value="optionOne" className="flex-1">
          Monthly
        </TabsTrigger>
        <TabsTrigger value="optionTwo" className="flex-1">
          Quarterly
        </TabsTrigger>
        <TabsTrigger value="optionThree" className="flex-1">
          Annually
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ChartTab;
