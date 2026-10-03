import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';
import { HeroVehicle } from '../types';
import { buildPerformanceRadarData } from '../utils/performance';
import { Activity, Zap, Award, CheckCircle2 } from 'lucide-react';

interface PerformanceRadarChartProps {
  vehicle: HeroVehicle;
}

export const PerformanceRadarChart: React.FC<PerformanceRadarChartProps> = ({ vehicle }) => {
  const { radarData, categoryProfile, overallRating, strongestTrait } = useMemo(() => {
    return buildPerformanceRadarData(vehicle);
  }, [vehicle]);

  const shortName = vehicle.name.replace(/^Hero\s+/i, '');

  return (
    <div className="space-y-4 bg-gradient-to-br from-[#0e0e0e] via-[#141414] to-[#101010] p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D6181F]/15 border border-[#D6181F]/40 flex items-center justify-center text-[#D6181F] shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white font-['Rajdhani'] flex items-center gap-2">
              Performance Radar Benchmark
              <span className="text-[10px] text-[#00FF88] font-bold bg-[#00FF88]/10 px-2 py-0.5 rounded border border-[#00FF88]/30 font-mono">
                Index: {overallRating}/100
              </span>
            </h3>
            <p className="text-[11px] text-gray-400">
              Comparing {shortName} vs. {categoryProfile.categoryLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
            <Award className="w-3 h-3 text-yellow-400" />
            Top Edge: <strong className="text-white">{strongestTrait.metric}</strong>
            <span className="text-[#00FF88]">
              ({strongestTrait.difference >= 0 ? `+${strongestTrait.difference}` : strongestTrait.difference} pts)
            </span>
          </span>
        </div>
      </div>

      {/* Radar Chart Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Chart Canvas */}
        <div className="lg:col-span-7 h-[260px] sm:h-[280px] w-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke="#333333" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: '#e5e7eb', fontSize: 11, fontWeight: 600 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 9 }}
                axisLine={false}
              />
              <Radar
                name={shortName}
                dataKey="vehicleScore"
                stroke="#D6181F"
                fill="#D6181F"
                fillOpacity={0.45}
                strokeWidth={2}
              />
              <Radar
                name={categoryProfile.categoryLabel}
                dataKey="categoryAvg"
                stroke="#60a5fa"
                fill="#60a5fa"
                fillOpacity={0.2}
                strokeWidth={1.5}
                strokeDasharray="4 4"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#181818] border border-white/15 p-2.5 rounded-lg shadow-xl text-xs space-y-1">
                        <div className="font-bold text-white uppercase text-[11px] font-['Rajdhani'] border-b border-white/10 pb-1">
                          {data.metric}
                        </div>
                        <div className="flex items-center justify-between gap-4 text-[#D6181F] font-semibold">
                          <span>{shortName}:</span>
                          <span className="font-mono font-bold">{data.vehicleScore}/100</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-blue-400">
                          <span>{categoryProfile.categoryLabel}:</span>
                          <span className="font-mono">{data.categoryAvg}/100</span>
                        </div>
                        <div className="text-[10px] text-gray-400 pt-1 border-t border-white/10">
                          Difference:{' '}
                          <span
                            className={
                              data.difference >= 0
                                ? 'text-[#00FF88] font-bold'
                                : 'text-yellow-400 font-bold'
                            }
                          >
                            {data.difference >= 0 ? `+${data.difference}` : data.difference} pts
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 10, fontSize: '11px' }}
                formatter={(value) => <span style={{ color: '#d1d5db' }}>{value}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Metric Cards */}
        <div className="lg:col-span-5 space-y-2">
          {radarData.map((item) => {
            const isAhead = item.difference >= 0;
            return (
              <div
                key={item.metric}
                className="bg-black/40 border border-white/5 hover:border-white/10 p-2.5 rounded-xl transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-[#D6181F]" />
                    {item.metric}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{item.vehicleScore}</span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isAhead
                          ? 'text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30'
                          : 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/30'
                      }`}
                    >
                      {isAhead ? `+${item.difference}` : item.difference} vs avg
                    </span>
                  </div>
                </div>

                {/* Progress bar comparing vehicle vs category */}
                <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden flex relative">
                  {/* Category marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10"
                    style={{ left: `${item.categoryAvg}%` }}
                    title={`Avg: ${item.categoryAvg}`}
                  />
                  <div
                    className="bg-[#D6181F] h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.vehicleScore}%` }}
                  />
                </div>

                <div className="flex items-center gap-1 text-[10px] text-gray-400 pt-0.5 line-clamp-1">
                  <CheckCircle2 className="w-3 h-3 text-[#00FF88] shrink-0" />
                  <span className="truncate">{item.keyHighlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
