type Props = {
  title: string;
  subtitle: string;
  onClick: () => void;
  variant?: "hospital" | "funeral";
};

export default function CategoryCard({
  title,
  subtitle,
  onClick,
  variant = "hospital",
}: Props) {
  return (
    <button className="card" onClick={onClick} type="button">
      <div className={`cardImageArea ${variant === "hospital" ? "isHospital" : "isFuneral"}`}>
        <div className="placeholderIcon" aria-hidden>
          {variant === "hospital" ? "🏥" : "🌈"}
        </div>
        <div className="placeholderText">
          {variant === "hospital" ? "동물병원 이미지 영역" : "장례식장 이미지 영역"}
        </div>
      </div>

      <div className="cardTextArea">
        <div className="cardTitle">{title}</div>
        <div className="cardSubtitle">{subtitle}</div>
      </div>
    </button>
  );
}
