const HospitalNews = () => {
  return (
    <div>
      {[1, 2, 3].map((v) => (
        <div
          key={v}
          style={{
            display: "flex",
            gap: 16,
            padding: 16,
            border: "1px solid #eee",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 120,
              height: 80,
              background: "#ddd",
            }}
          />
          <div>
            <p style={{ fontWeight: 600 }}>병원 소식 제목 {v}</p>
            <p style={{ fontSize: 14, color: "#666" }}>
              백엔드 연동 예정 내용
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HospitalNews;
