import React, { useState } from 'react';
import { Region, MLClusterResult } from '../types';
import { runKMeansClustering } from '../services/mlEngine';
import { ClusterScatterPlot } from '../components/ClusterScatterPlot';
import { Cpu, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';

interface ClusteringViewProps {
  regions: Region[];
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
}

export const ClusteringView: React.FC<ClusteringViewProps> = ({
  regions,
  selectedRegionId,
  onSelectRegion
}) => {
  const [k, setK] = useState(5);
  const [clusterResult, setClusterResult] = useState<MLClusterResult>(() =>
    runKMeansClustering(regions, 5)
  );

  const handleRunClustering = (newK: number) => {
    setK(newK);
    const result = runKMeansClustering(regions, newK);
    setClusterResult(result);
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-[#008C95] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#008C95]" />
            Unsupervised Machine Learning
          </div>
          <h2 className="text-2xl font-bold text-[#173B63] mt-1">
            Regional Economic Typology Clustering
          </h2>
          <p className="text-xs text-[#5B6B7A] mt-1 max-w-2xl leading-relaxed">
            K-Means clustering algorithm partitioning {regions.length} districts across 10 standardized features (agriculture, manufacturing, services, literacy, youth %, connectivity, renewables).
          </p>
        </div>

        {/* K Selector */}
        <div className="flex items-center gap-3">
          <label htmlFor="k-clusters-select" className="text-xs font-semibold text-[#173B63]">Clusters (K):</label>
          <div className="flex items-center gap-1 bg-[#EEF3F7] p-1 rounded-lg border border-slate-200">
            {[3, 4, 5, 6, 7].map((num) => (
              <button
                key={num}
                onClick={() => handleRunClustering(num)}
                className={`px-3 py-1 text-xs font-bold font-mono rounded cursor-pointer transition-all ${
                  k === num ? 'bg-[#173B63] text-white shadow-xs' : 'text-[#5B6B7A] hover:text-[#173B63]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleRunClustering(k)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#173B63] hover:bg-[#102A43] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Cluster</span>
          </button>
        </div>
      </div>

      {/* Model Parameters & Inertia */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#008C95]" />
          <span className="text-[#5B6B7A] block text-[11px] font-medium">Selected Clusters (K)</span>
          <span className="font-bold text-[#173B63] font-mono text-base">{clusterResult.k} Typologies</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#173B63]" />
          <span className="text-[#5B6B7A] block text-[11px] font-medium">Algorithm Inertia</span>
          <span className="font-bold text-[#173B63] font-mono text-base">{clusterResult.inertia}</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#F59E0B]" />
          <span className="text-[#5B6B7A] block text-[11px] font-medium">Standardization</span>
          <span className="font-bold text-[#173B63] font-mono text-base">Z-Score (μ=0, σ=1)</span>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E8B57]" />
          <span className="text-[#5B6B7A] block text-[11px] font-medium">Centroid Initialization</span>
          <span className="font-bold text-[#173B63] font-mono text-base">K-Means++</span>
        </div>
      </div>

      {/* Scatter Plot Projection */}
      <ClusterScatterPlot
        regions={regions}
        clusterResult={clusterResult}
        selectedRegionId={selectedRegionId}
        onSelectRegion={onSelectRegion}
      />

      {/* Dynamic Cluster Profiles Detail Cards */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#173B63]">
            Generated Cluster Typology Profiles
          </h3>
          <p className="text-xs text-[#5B6B7A] mt-0.5">
            Cluster designations and strategic themes are dynamically synthesized from each centroid’s highest standardized deviations from national averages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clusterResult.clusters.map((cluster) => {
            const clusterColors = ['#008C95', '#173B63', '#F59E0B', '#2E8B57', '#8EC5CC', '#D97706'];
            const accentColor = clusterColors[cluster.clusterId % clusterColors.length];

            return (
              <div
                key={cluster.clusterId}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accentColor }} />

                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#5B6B7A] font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                      Cluster #{cluster.clusterId + 1} · {cluster.size} Districts
                    </span>
                    <h4 className="text-base font-bold text-[#173B63] mt-0.5">
                      {cluster.clusterName}
                    </h4>
                  </div>
                  <span className="text-xs font-semibold bg-[#EEF3F7] text-[#173B63] px-2.5 py-1 rounded">
                    {cluster.size} nodes
                  </span>
                </div>

                <p className="text-xs text-[#5B6B7A] leading-relaxed">
                  {cluster.description}
                </p>

                {/* Dominant Centroid Features */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-[#173B63] text-[11px] uppercase tracking-wider">
                    Centroid Z-Score Deviations:
                  </span>
                  <div className="grid grid-cols-2 gap-2 font-mono tabular-nums">
                    {cluster.dominantFeatures.slice(0, 4).map((f) => (
                      <div key={f.feature} className="p-2 bg-[#EEF3F7] rounded border border-slate-200">
                        <span className="text-[10px] text-[#5B6B7A] font-sans block truncate">{f.feature}</span>
                        <span className={`font-bold ${f.zScore >= 0 ? 'text-[#2E8B57]' : 'text-[#5B6B7A]'}`}>
                          {f.zScore >= 0 ? `+${f.zScore}` : f.zScore}σ (avg: {f.meanVal})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Strategic Themes */}
                <div className="space-y-1 text-xs pt-1">
                  <span className="font-bold text-[#173B63] text-[11px] uppercase tracking-wider">
                    Recommended Strategic Interventions:
                  </span>
                  <ul className="list-disc pl-4 space-y-1 text-[#5B6B7A] marker:text-[#008C95]">
                    {cluster.recommendedStrategicThemes.map((theme, i) => (
                      <li key={i}>{theme}</li>
                    ))}
                  </ul>
                </div>

                {/* Member Districts */}
                <div className="pt-2 border-t border-slate-100 text-xs">
                  <span className="text-[11px] text-[#5B6B7A] block mb-1.5 font-medium">Constituent Districts:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cluster.regions.map(r => (
                      <button
                        key={r.id}
                        onClick={() => onSelectRegion(r.id)}
                        className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                          selectedRegionId === r.id
                            ? 'bg-[#173B63] text-white font-bold'
                            : 'bg-[#EEF3F7] text-[#172B4D] hover:bg-slate-200'
                        }`}
                      >
                        {r.name} ({r.state})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
