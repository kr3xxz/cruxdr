interface Props {
  severity: string;
  title: string;
  source_ip: string;
  technique: string;
}

export function AlertCard({
  severity,
  title,
  source_ip,
  technique,
}: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-red-400 font-semibold uppercase">
          {severity}
        </span>

        <span className="text-zinc-500 text-sm">
          {technique}
        </span>
      </div>

      <h3 className="text-white font-medium">
        {title}
      </h3>

      <p className="text-zinc-400 text-sm mt-2">
        Source IP: {source_ip}
      </p>
    </div>
  );
}
