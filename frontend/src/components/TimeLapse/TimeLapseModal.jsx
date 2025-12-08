// import "./PlantAddModal.css";

export function TimeLapseModal({ onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* X 버튼 */}
        <button className="back-btn" onClick={onClose}>
          ←
        </button>

        <h2>타임랩스</h2>

        <div className="modal-content">
          <label>식물 종류</label>
          <button className="submit-btn">등록하기</button>
        </div>
      </div>
    </div>
  );
}
