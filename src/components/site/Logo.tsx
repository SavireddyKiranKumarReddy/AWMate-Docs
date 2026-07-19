import logoAsset from "@/assets/aw-logo.png.asset.json";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center overflow-hidden rounded-[6px]"
      style={{ width: size, height: size, background: "#000" }}
      aria-hidden="true"
    >
      <img src={logoAsset.url} alt="" width={size} height={size} className="block" />
    </span>
  );
}

export function BetaBadge() {
  return (
    <span className="inline-flex h-5 items-center rounded-[6px] border border-border px-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-text-secondary">
      Beta
    </span>
  );
}
