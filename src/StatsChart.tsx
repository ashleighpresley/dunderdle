import { useStore } from "./store";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

export const StatsChart = () => {
  const state = useStore();
  return (
    <div>
      <Bar
        data={{
          labels: ["0", "1", "2", "3", "4", "5"],
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
        options={{
          indexAxis: "y",
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                stepSize: 1,
              },
            },
            y: {
              grid: {
                display: false,
              },
            },
          },
        }}
      />
    </div>
  );
};
