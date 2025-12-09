import React, {useState} from "react";
import "./MyPageTimelapse.css"; // 타임랩스 전용 CSS
import "../MyPage/MyPage.css"; // 부모 CSS도 함께 적용되도록
// import TimelapseSettingsModal from "./TimelapseSettingsModal";

function MyPageTimelapse() {
  // 예시 데이터 (추후 API로 대체)
  const timelapseData = [
    {
      serial: "NOVA-2000",
      farms: [
        {
          farmName: "방울토마토 농장 1",
          timelapses: [
            {
              id: 1,
              title: "성장기록 1차",
              status: "DONE",
              size: "45MB",
            },
            {
              id: 2,
              title: "성장기록 2차",
              status: "PROGRESS",
              progress: 62,
            },
            {
              id: 3,
              title: "성장기록 3차",
              status: "PENDING",
            },
          ],
        },
      ],
    },
    {
      serial: "NOVA-2001",
      farms: [
        {
          farmName: "허브 농장 1",
          timelapses: [],
        },
      ],
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="timelapse-page">
      <h1 className="timelapse-title">타임랩스 관리</h1>

      {timelapseData.map((device) => (
        <div key={device.serial} className="device-box">
          <h2 className="device-title">{device.serial}</h2>

          {device.farms.map((farm, i) => (
            <div key={i} className="farm-box">
              <h3 className="farm-title">{farm.farmName}</h3>

              {/* 타임랩스 없음 */}
              {farm.timelapses.length === 0 && (
                <div className="no-timelapse">타임랩스가 없습니다.</div>
              )}

              <div className="timelapse-list">
                {farm.timelapses.map((tl) => (
                  <div key={tl.id} className={`timelapse-card status-${tl.status.toLowerCase()}`}>
                    <h4 className="tl-title">{tl.title}</h4>

                    {/* 완료된 타임랩스 */}
                    {tl.status === "DONE" && (
                      <div className="tl-actions">
                        <button className="view-btn">보기</button>
                        <button className="download-btn">다운로드</button>
                        <div className="tl-size">용량: {tl.size}</div>
                      </div>
                    )}

                    {/* 제작중 타임랩스 */}
                    {tl.status === "PROGRESS" && (
                      <div className="progress-box">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: `${tl.progress}%`}}></div>
                        </div>
                        <div className="progress-text">{tl.progress}% 생성 중...</div>
                      </div>
                    )}

                    {/* 제작 예정 타임랩스 */}
                    {tl.status === "PENDING" && <div className="pending-text">제작 예정</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* 타임랩스 생성 버튼 */}
      <button className="create-timelapse-btn" onClick={() => setIsModalOpen(true)}>
        타임랩스 생성
      </button>

      {/* 모달 */}
      {/* <TimelapseSettingsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </div>
  );
}

export default MyPageTimelapse;
