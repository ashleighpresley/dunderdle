import { useStore } from "./store";

export const StatsScreen = () => {
  const state = useStore();
  return (
    <div className="my-4 leading-relaxed grid grid-cols-4 gap-10 text-center">
      <div>
        <p className="text-5xl">{state.losses + state.wins}</p>
        <p>Played</p>
      </div>
      <div>
        <p className="text-5xl">{state.winRate}</p>
        <p>Win %</p>
      </div>
      <div>
        <p className="text-5xl">{state.curStreak}</p>
        <p>Current Streak</p>
      </div>
      <div>
        <p className="text-5xl">{state.bestStreak}</p>
        <p>Best Streak</p>
      </div>
    </div>
  );
};
