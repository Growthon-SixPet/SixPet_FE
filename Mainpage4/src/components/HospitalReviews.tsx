const HospitalReviews = () => {
  return (
    <div>
      {[1, 2, 3].map((v) => (
        <div
          key={v}
          style={{
            border: "1px solid #eee",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <p style={{ fontWeight: 600 }}>⭐⭐⭐⭐⭐</p>
          <p style={{ fontSize: 14 }}>
            정말 친절하고 설명 잘해주셨어요.
          </p>
        </div>
      ))}
    </div>
  );
};

export default HospitalReviews;
