const metrics = [
  { key: 'R', label: 'Reached', color: 'bg-primary' },
  { key: 'B', label: 'Born Again', color: 'bg-success' },
  { key: 'D', label: 'Discipled', color: 'bg-info' },
  { key: 'S', label: 'Schools', color: 'bg-warning' },
  { key: 'C', label: 'Counties', color: 'bg-accent' },
  { key: 'P', label: 'Partners Trained', color: 'bg-muted-foreground' },
];

export const MetricKey = () => {
  return (
    <div className="flex flex-wrap gap-4 p-4 card-elevated">
      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Key:</span>
      {metrics.map((metric) => (
        <div key={metric.key} className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${metric.color}`} />
          <span className="text-sm text-foreground">
            <span className="font-bold">{metric.key}</span> – {metric.label}
          </span>
        </div>
      ))}
    </div>
  );
};
