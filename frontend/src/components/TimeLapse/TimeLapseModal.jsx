import React from "react";
import "./TimeLapseModal.css";

export default function TimeLapseModal({farm, onClose}) {
  // 🔥 모달에서 자체적으로 사용하는 타임랩스 목데이터
  const mockTimelapseList = [
    {
      id: 1,
      name: "전체 영상 1",
      preset_step_id: 1,
      duration: 10,
      fps: 30,
      resolution: "1920x1080",
      interval: null,
      farm_id: null,
      setting_id: null,
      state: "PENDING",
    },
    {
      id: 2,
      name: "전체 영상 2",
      preset_step_id: 2,
      duration: 15,
      fps: 24,
      resolution: "1920x1080",
      interval: null,
      farm_id: null,
      setting_id: null,
      state: "PROCESSING",
    },
    {
      id: 3,
      name: "전체 영상 3",
      preset_step_id: 3,
      duration: 20,
      fps: 30,
      resolution: "1920x1080",
      interval: null,
      farm_id: null,
      setting_id: null,
      state: "DONE",
    },
  ];

  // state → 표시 문자열 변환
  const convertState = (s) => {
    switch (s) {
      case "PENDING":
        return "제작 예정";
      case "PROCESSING":
        return "제작 중";
      case "DONE":
        return "제작 완료";
      default:
        return "-";
    }
  };

  return (
    <div className="timelapse-modal-overlay">
      <div className="timelapse-modal">
        <h2 className="modal-title">📽 {farm?.farmName} 타임랩스 목록</h2>

        <div className="timelapse-list">
          {mockTimelapseList.map((item) => (
            <div className="timelapse-item" key={item.id}>
              <div className="info-row">
                <span className="label">이름:</span>
                <span className="value">{item.name}</span>
              </div>

              <div className="info-row">
                <span className="label">상태:</span>
                <span className={`state state-${item.state.toLowerCase()}`}>
                  {convertState(item.state)}
                </span>
              </div>

              <div className="info-row">
                <span className="label">길이:</span>
                <span className="value">{item.duration}초</span>
              </div>

              <div className="info-row">
                <span className="label">FPS:</span>
                <span className="value">{item.fps}</span>
              </div>

              <div className="info-row">
                <span className="label">해상도:</span>
                <span className="value">{item.resolution}</span>
              </div>

              <div className="info-row">
                <span className="label">스텝 ID:</span>
                <span className="value">{item.preset_step_id}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="close-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}
