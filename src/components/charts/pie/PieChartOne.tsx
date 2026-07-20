import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface PieChartProps {
  series?: number[];
  labels?: string[];
  colors?: string[];
}

export default function PieChartOne({
  series = [44, 55, 41, 17, 15],
  labels = ["Option A", "Option B", "Option C", "Option D", "Option E"],
  colors = ["#465fff", "#10b981", "#f59e0b", "#f05252", "#0ea5e9"],
}: PieChartProps) {
  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
    },
    colors: colors,
    labels: labels,
    legend: {
      show: true,
      position: "bottom",
      fontFamily: "Outfit",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Chart options={options} series={series} type="donut" height={320} width={380} />
    </div>
  );
}
