export default function SectionHeading({
  title,
  description,
  align = "left",
}: {
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <h2 className="font-heading text-3xl leading-[1.1] md:text-4xl">{title}</h2>
      {description && (
        <p
          className={`mt-3 text-[15px] text-ink/60 ${
            align === "center" ? "mx-auto max-w-[46ch]" : "max-w-[46ch]"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
