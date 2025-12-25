const HospitalDoctors = () => {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {[1, 2, 3].map((v) => (
        <div
          key={v}
          style={{
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 16,
            display: "flex",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 80,
              height: 100,
              background: "#ccc",
            }}
          />
          <div>
            <p style={{ fontWeight: 600 }}>수의사 이름</p>
            <p style={{ fontSize: 14, color: "#666" }}>
              전문 분야 / 경력
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HospitalDoctors;
