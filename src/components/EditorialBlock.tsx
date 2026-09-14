import Image from "next/image";

export default function EditorialBlock({
  eyebrow,
  headline,
  description,
  image,
  reverse = false,
}: {
  eyebrow: string;
  headline: string;
  description: string;
  image: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${
        reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-grey">
        <Image src={image} alt={headline} fill className="object-cover" />
      </div>
      <div>
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h3 className="font-heading text-3xl leading-[1.15] md:text-4xl">{headline}</h3>
        <p className="mt-4 max-w-[42ch] text-[15px] text-ink/60">{description}</p>
      </div>
    </div>
  );
}
