import React, { useState } from "react";
// import "./FarmCreateModal.css"; // 기존 스타일 재사용

export const TimeCreateModal = ({ farm, onClose, onCreate }) => {
  const [memo, setMemo] = useState("");

  const handleSubmit = () => {
    // 1단계 데이터(prevData)와 2단계 데이터(memo)를 합쳐서 최종 저장
    const finalData = {
      ...farm,
      memo: memo, // 추가된 데이터
    };
    onCreate(finalData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0, fontSize: "1.25rem" }}>팜 생성 - 타임랩스 설정</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="form-section">
            <h3 style={{fontSize: "1rem", marginBottom: "10px"}}>1단계 입력 정보 확인</h3>
            <div style={{ background: "#f1f5f9", padding: "12px", borderRadius: "8px", fontSize: "0.9rem", color: "#475569" }}>
              <p><strong>팜 이름:</strong> {farm.farmName}</p>
              <p><strong>작물 종류:</strong> {farm.plantType}</p>
              <p><strong>총 단계 수:</strong> {farm.stages.length}단계</p>
            </div>
          </div>

          <div className="form-section" style={{ marginTop: "20px" }}>
            <label className="label">추가 메모 (선택사항)</label>
            <textarea
              className="input-field"
              style={{ height: "100px", resize: "none" }}
              placeholder="해당 팜에 대한 관리 메모를 입력하세요."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>취소</button>
          <button className="btn-submit" onClick={handleSubmit}>
            최종 생성 완료
          </button>
        </div>
      </div>
    </div>
  );
};