import React from 'react';

export interface ComparisonBarItem {
  label: string;
  baseline: number;
  scenario?: number;
  scenarioB?: number;
  scenarioC?: number;
}

interface BarComparisonChartProps {
  items: ComparisonBarItem[];
  title?: string;
  labels?: {
    baseline?: string;
    scenario?: string;
    scenarioB?: string;
    scenarioC?: string;
  };
}

export const BarComparisonChart: React.FC<BarComparisonChartProps> = ({
  items,
  title,
  labels = {
    baseline: 'Current Baseline',
    scenario: 'Scenario A (Teal)',
    scenarioB: 'Scenario B (Saffron)',
    scenarioC: 'Scenario C (Green)'
  }
}) => {
  const hasScenarioB = items.some(i => i.scenarioB !== undefined);
  const hasScenarioC = items.some(i => i.scenarioC !== undefined);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
      {title && (
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#EEF3F7] gap-3">
          <h4 className="text-sm font-bold text-[#173B63]">{title}</h4>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5B6B7A]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#173B63]" />
              <span className="text-[#173B63]">{labels.baseline}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#008C95]" />
              <span className="text-[#008C95]">{labels.scenario}</span>
            </span>
            {hasScenarioB && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" />
                <span className="text-[#F59E0B]">{labels.scenarioB}</span>
              </span>
            )}
            {hasScenarioC && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#2E8B57]" />
                <span className="text-[#2E8B57]">{labels.scenarioC}</span>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {items.map((item) => {
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#172B4D]">{item.label}</span>
                <div className="flex items-center gap-3 font-mono tabular-nums">
                  <span className="text-[#173B63] font-medium">{item.baseline}</span>
                  {item.scenario !== undefined && (
                    <span className="font-bold text-[#008C95]">
                      → {item.scenario} ({item.scenario >= item.baseline ? `+${(item.scenario - item.baseline).toFixed(1)}` : (item.scenario - item.baseline).toFixed(1)})
                    </span>
                  )}
                  {item.scenarioB !== undefined && (
                    <span className="font-bold text-[#F59E0B]">
                      B: {item.scenarioB}
                    </span>
                  )}
                  {item.scenarioC !== undefined && (
                    <span className="font-bold text-[#2E8B57]">
                      C: {item.scenarioC}
                    </span>
                  )}
                </div>
              </div>

              {/* Stacked comparison bars adhering to standardized palette */}
              <div className="space-y-1">
                {/* Baseline bar in Deep Navy #173B63 */}
                <div className="w-full bg-[#EEF3F7] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#173B63] h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, item.baseline))}%` }}
                  />
                </div>

                {/* Scenario A bar in Teal #008C95 */}
                {item.scenario !== undefined && (
                  <div className="w-full bg-[#DCEAF2] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#008C95] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, item.scenario))}%` }}
                    />
                  </div>
                )}

                {/* Scenario B bar in Saffron #F59E0B */}
                {item.scenarioB !== undefined && (
                  <div className="w-full bg-[#FEF3C7] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#F59E0B] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, item.scenarioB))}%` }}
                    />
                  </div>
                )}

                {/* Scenario C bar in Green #2E8B57 */}
                {item.scenarioC !== undefined && (
                  <div className="w-full bg-[#DCFCE7] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2E8B57] h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, item.scenarioC))}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
