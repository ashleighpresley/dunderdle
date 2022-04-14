import { useStore } from "./store";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const StatsChart = () => {
  const state = useStore();
  return (
    <div>
      <Bar
        data={{
          labels: ["1", "2", "3", "4", "5", "6"],
          datasets: [
            {
              label: "Guess Distribution",
              data: [
                state.winDistribution[0],
                state.winDistribution[1],
                state.winDistribution[2],
                state.winDistribution[3],
                state.winDistribution[4],
                state.winDistribution[5],
              ],
              barThickness: 30,
              backgroundColor: "rgb(16 185 129)",
            },
          ],
        }}
        height={300}
        options={
          state.theme === "dark"
            ? {
                indexAxis: "y",
                maintainAspectRatio: false,
                color: "white",
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      stepSize: 1,
                      color: "white",
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "white",
                    },
                  },
                },
              }
            : {
                indexAxis: "y",
                maintainAspectRatio: false,
                color: "black",
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      stepSize: 1,
                      color: "black",
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "black",
                    },
                  },
                },
              }
        }
      />
    </div>
  );
};
