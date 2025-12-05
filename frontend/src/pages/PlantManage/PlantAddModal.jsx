import "./PlantAddModal.css";

function PlantAddModal({ onClose }) {
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* X 버튼 */}
        <button className="back-btn" onClick={onClose}>
          ←
        </button>

        <h2>식물 등록하기</h2>

        <div className="modal-content">
          <label>식물 종류</label>
          <input type="text" placeholder="예: 바질, 토마토, 상추" />

          <label>식물 사진 업로드</label>
          <input type="file" />

          <button className="submit-btn">등록하기</button>
        </div>
      </div>
    </div>
  );
}

export default PlantAddModal;
