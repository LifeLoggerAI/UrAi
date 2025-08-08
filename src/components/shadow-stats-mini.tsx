export function ShadowStatsMini({ entropyLevel }: { entropyLevel: number }) {
  return (
    <div className="text-sm text-red-500">
      Shadow Level: {Math.round(entropyLevel * 100)}%
    </div>
  );
}