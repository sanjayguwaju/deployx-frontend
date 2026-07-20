import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface LineChartProps {
  series?: { name: string; data: number[] }[];
  categories?: string[];
  colors?: string[];
}

export default function LineChartOne({
  series = [
    {
      name: "Sales",
      data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    },
    {
      name: "Revenue",
      data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
    },
  ],
  categories = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  colors = ["#465FFF", "#9CB9FF"],
}: LineChartProps) {
  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    colors: colors,
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      borderColor: "#e5e7eb",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: ["#6B7280"],
        },
      },
    },
  };

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartOne" className="min-w-[700px]">
        <Chart options={options} series={series} type="area" height={310} />
      </div>
    </div>
  );
}
