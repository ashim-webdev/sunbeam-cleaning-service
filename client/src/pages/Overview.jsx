import AppAreaChart from "../components/OverviewComponents/AppAreaChart";
import AppBarChart from "../components/OverviewComponents/AppBarChart";
import AppPieChart from "../components/OverviewComponents/AppPieChart";
import CardList from "../components/OverviewComponents/CardList";

const Overview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-4 gap-4 mb-4 h-auto w-full">
      <div className="bg-primary-foreground h-full px-4 pt-6 pb-2 rounded-lg lg:col-span-1 xl:col-span-1 2xl:col-span-2">
        <AppBarChart />
      </div>
      <div className="bg-primary-foreground h-full px-4 pt-6 pb-2 rounded-lg">
        <CardList title="Latest Transactions" />
      </div>
      <div className="bg-primary-foreground h-full px-4 pt-6 pb-2 rounded-lg">
        <AppPieChart />
      </div>

      <div className="bg-primary-foreground h-full px-4 pt-6 pb-2  rounded-lg lg:col-span-1 xl:col-span-1 2xl:col-span-2">
        <AppAreaChart />
      </div>
      <div className="bg-primary-foreground h-fit px-4 pt-6 pb-2 rounded-lg">
        <CardList title="Popular Content" />
      </div>
    </div>
  );
};

export default Overview;
