// 드라이브 /preview 임베드. url 이 없으면 시안과 동일한 자리표시 박스를 보여준다.
// kind: "video" = 16:9 시연 영상, "doc" = 16:10 발표 자료(PDF).
type Props = {
  url: string | null;
  kind: "video" | "doc";
  label: string;
};

export default function Embed({ url, kind, label }: Props) {
  const ratio = kind === "video" ? "aspect-video" : "aspect-[16/10]";

  if (url) {
    return (
      <div className={`overflow-hidden rounded-2xl bg-soft ${ratio}`}>
        <iframe
          src={url}
          title={label}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="size-full border-0"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl bg-soft text-muted ${ratio}`}
    >
      <span
        className={
          kind === "video"
            ? "flex size-[50px] items-center justify-center rounded-full bg-accent text-[17px]"
            : "flex size-[50px] items-center justify-center rounded-full bg-ground text-[17px] shadow-[0_1px_4px_rgba(0,0,0,0.1)]"
        }
        aria-hidden
      >
        {kind === "video" ? "▶" : "▤"}
      </span>
      <span className="text-[12.5px] font-semibold">{label}</span>
    </div>
  );
}
