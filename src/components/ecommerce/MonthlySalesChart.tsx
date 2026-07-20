import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreDotIcon } from "../../icons";


export default function MonthlySalesChart() {
  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
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
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      x: {
        show: false,
      },
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };
  const series = [
    {
      name: "Sales",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];
  // Radix handles state automatically, so we don't need isOpen/setIsOpen unless we want controlled state

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>
        <div className="relative inline-block">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="dropdown-toggle">
                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                className="z-50 min-w-[160px] rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 dark:border-gray-800 dark:bg-gray-dark"
              >
                <DropdownMenu.Item asChild>
                  <button className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                    View More
                  </button>
                </DropdownMenu.Item>
                <DropdownMenu.Item asChild>
                  <button className="flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 outline-none hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:bg-gray-800">
                    Delete
                  </button>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </div>
  );
}
