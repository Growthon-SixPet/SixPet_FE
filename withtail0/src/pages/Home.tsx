import styled from "styled-components";

export default function Home() {
  return (
    <Page>
      {/* Header는 협업 컴포넌트로 위에서 붙인다고 가정 */}

      <Main>
        <Content>
          <CardArea>
            <CardButton type="button">
              <CardTitle>동물병원</CardTitle>
              <CardDesc>진료 가능한 병원 검색</CardDesc>
            </CardButton>

            <CardButton type="button">
              <CardTitle>장례식장</CardTitle>
              <CardDesc>장례 · 추모 서비스 안내</CardDesc>
            </CardButton>
          </CardArea>
        </Content>
      </Main>
    </Page>
  );
}

/* ===== layout ===== */

/** 1200 넘어가면 스크롤 */
const Page = styled.div`
  height: 100vh;
  overflow-y: auto;
`;

/** 회색 배경 메인 영역 */
const Main = styled.main`
  background: #d9d9d9;
  min-height: 1200px;
  padding: 80px 0;
`;

/** 1280 기준 + 좌우 240 여백 */
const Content = styled.div`
  margin: 0 auto;
  padding: 0 240px;

  @media (max-width: 1280px) {
    padding: 0 24px;
  }
`;


/* ===== cards ===== */

const CardArea = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 120px;
`;

/** 네모 버튼 카드 */
const CardButton = styled.button`
  width: 360px;
  height: 720px;
  background: #8f6f6f;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.div`
  font-size: 40px;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 12px;
`;

const CardDesc = styled.div`
  font-size: 18px;
  color: #ffffff;
  opacity: 0.9;
`;
