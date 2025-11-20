import { PokemonStats } from '../types';
import styles from '../styles/radarChart.module.css';

interface StatsRadarChartProps {
  stats: PokemonStats;
  size?: number;
}

export default function StatsRadarChart({ stats, size = 300 }: StatsRadarChartProps) {
  const statKeys = ['hp', 'attack', 'defense', 'special_attack', 'special_defense', 'speed'];
  const statLabels: Record<string, string> = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    special_attack: 'SP.ATK',
    special_defense: 'SP.DEF',
    speed: 'SPD'
  };

  const maxStat = 200; // Typical max stat value
  const center = size / 2;
  const radius = (size / 2) - 60;
  const angleStep = (Math.PI * 2) / statKeys.length;

  // Calculate polygon points for the stat values
  const points = statKeys.map((key, index) => {
    const value = stats[key] || 0;
    const percentage = Math.min(value / maxStat, 1);
    const angle = angleStep * index - Math.PI / 2; // Start from top
    const x = center + radius * percentage * Math.cos(angle);
    const y = center + radius * percentage * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  // Generate reference circles
  const circles = [0.2, 0.4, 0.6, 0.8, 1.0].map(scale => {
    const circlePoints = statKeys.map((_, index) => {
      const angle = angleStep * index - Math.PI / 2;
      const x = center + radius * scale * Math.cos(angle);
      const y = center + radius * scale * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    return circlePoints;
  });

  // Generate axis lines
  const axes = statKeys.map((_, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x1: center, y1: center, x2: x, y2: y };
  });

  // Generate labels
  const labels = statKeys.map((key, index) => {
    const angle = angleStep * index - Math.PI / 2;
    const labelDistance = radius + 35;
    const x = center + labelDistance * Math.cos(angle);
    const y = center + labelDistance * Math.sin(angle);
    return {
      x,
      y,
      label: statLabels[key],
      value: stats[key] || 0
    };
  });

  return (
    <div className={styles.radarContainer}>
      <svg width={size} height={size} className={styles.radarSvg}>
        {/* Background circles */}
        {circles.map((circlePoints, i) => (
          <polygon
            key={`circle-${i}`}
            points={circlePoints}
            className={styles.gridPolygon}
            strokeOpacity={0.2 + i * 0.1}
          />
        ))}

        {/* Axis lines */}
        {axes.map((axis, i) => (
          <line
            key={`axis-${i}`}
            x1={axis.x1}
            y1={axis.y1}
            x2={axis.x2}
            y2={axis.y2}
            className={styles.axisLine}
          />
        ))}

        {/* Stat polygon */}
        <polygon
          points={points}
          className={styles.statPolygon}
        />
        <polygon
          points={points}
          className={styles.statPolygonFill}
        />

        {/* Data points */}
        {statKeys.map((key, index) => {
          const value = stats[key] || 0;
          const percentage = Math.min(value / maxStat, 1);
          const angle = angleStep * index - Math.PI / 2;
          const x = center + radius * percentage * Math.cos(angle);
          const y = center + radius * percentage * Math.sin(angle);
          return (
            <circle
              key={`point-${index}`}
              cx={x}
              cy={y}
              r="4"
              className={styles.dataPoint}
            />
          );
        })}

        {/* Labels */}
        {labels.map((label, i) => (
          <g key={`label-${i}`}>
            <text
              x={label.x}
              y={label.y - 8}
              textAnchor="middle"
              className={styles.labelText}
            >
              {label.label}
            </text>
            <text
              x={label.x}
              y={label.y + 8}
              textAnchor="middle"
              className={styles.valueText}
            >
              {label.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
