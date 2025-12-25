import { useEffect, useState } from "react";
import { createReservation } from "../api/reservation";

interface Props {
  hospitalId: number;
  onClose: () => void;
}

/* 🔥 전화번호 하이픈 자동 포맷 */
const formatPhoneNumber = (value: string) => {
  const numbersOnly = value.replace(/\D/g, "");

  if (numbersOnly.length <= 3) return numbersOnly;
  if (numbersOnly.length <= 7)
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
  return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
};

export default function ReservationModal({ hospitalId, onClose }: Props) {
  const [open, setOpen] = useState(false);

  /* form state 통일 (phoneNumber 사용) */
  const [form, setForm] = useState({
    petName: "",
    ownerName: "",
    phoneNumber: "",
    date: "",
    time: "",
    reason: "",
  });

  useEffect(() => {
    setTimeout(() => setOpen(true), 10);
  }, []);

  const times = ["09:30", "10:00", "10:30", "11:00", "14:00", "15:00"];

  /* 🔥 submit */
  const submit = async () => {
    if (
      !form.petName ||
      !form.ownerName ||
      !form.phoneNumber ||
      !form.date ||
      !form.time ||
      !form.reason
    ) {
      alert("모든 항목 입력");
      return;
    }

    const payload = {
      ownerName: form.ownerName.trim(),
      phoneNumber: form.phoneNumber, 
      petName: form.petName.trim(),
      reservationDate: form.date,
      reservationTime: form.time,
      visitReason: form.reason.trim(),
    };

    console.log("예약 payload:", payload);

    try {
      await createReservation(1, payload); // targetId = 1 (병원)
      alert("예약 요청 완료");
      onClose();
    } catch (e: any) {
      console.error("예약 실패:", e.response?.data);
      alert(e.response?.data?.message ?? "예약 실패");
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div
        style={{
          ...modal,
          transform: open ? "translateY(0)" : "translateY(-40px)",
          opacity: open ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>예약하기</h2>

        <Input
          label="동물 이름"
          value={form.petName}
          onChange={(v) => setForm({ ...form, petName: v })}
        />

        <Input
          label="보호자 이름"
          value={form.ownerName}
          onChange={(v) => setForm({ ...form, ownerName: v })}
        />

        <Input
          label="휴대폰 번호"
          placeholder="010-3326-1096"
          value={form.phoneNumber}
          onChange={(v) =>
            setForm({
              ...form,
              phoneNumber: formatPhoneNumber(v), // 🔥 핵심
            })
          }
        />

        <Input
          label="예약 날짜"
          type="date"
          value={form.date}
          onChange={(v) => setForm({ ...form, date: v })}
        />

        <div style={{ marginBottom: 20 }}>
          <p>예약 시간</p>
          <div style={timeGrid}>
            {times.map((t) => (
              <button
                key={t}
                style={form.time === t ? timeActive : timeBtn}
                onClick={() => setForm({ ...form, time: t })}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <textarea
          placeholder="방문 사유"
          style={textarea}
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

     <div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 32,
  }}
>
  {/* 취소 */}
  <button
    onClick={onClose}
    style={{
      width: 140,
      height: 56,
      borderRadius: 16,
      border: "2px solid #d9e1ea",
      background: "#fff",
      color: "#5f6b7a",
      fontSize: 18,
      fontWeight: 600,
      cursor: "pointer",
    }}
  >
    취소
  </button>

  {/* 저장(예약) */}
  <button
    onClick={submit}
    style={{
      width: 140,
      height: 56,
      borderRadius: 16,
      border: "none",
      background: "#5ba9d6",
      color: "#fff",
      fontSize: 18,
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    예약
  </button>
</div>
      </div>
    </div>
  );
}

/* ===== 공통 Input ===== */

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div style={{ marginBottom: 20 }}>
    <p>{label}</p>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      style={input}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

/* ===== 스타일 ===== */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: 40,
  zIndex: 9999,
};

const modal: React.CSSProperties = {
  width: 620,
  height: 1252,
  background: "#fff",
  padding: 32,
  transition: "all 0.25s ease",
};

const input: React.CSSProperties = {
  width: "100%",
  height: 40,
  border: "1px solid #ddd",
  borderRadius: 6,
  padding: "0 12px",
};

const textarea: React.CSSProperties = {
  width: "100%",
  height: 100,
  border: "1px solid #ddd",
  borderRadius: 6,
  padding: 12,
};

const timeGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 8,
};

const timeBtn: React.CSSProperties = {
  height: 44,
  border: "1px solid #ddd",
  borderRadius: 6,
  background: "#f2f2f2",
};

const timeActive: React.CSSProperties = {
  ...timeBtn,
  background: "#5ba9d6",
  color: "#fff",
  border: "none",
};

const submitBtn: React.CSSProperties = {
  height: 56,
  background: "#5ba9d6",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  marginTop: 20,
};

const cancelBtn: React.CSSProperties = {
  height: 56,
  background: "#fff",
  border: "1px solid #333",
  borderRadius: 8,
  marginTop: 12,
};

