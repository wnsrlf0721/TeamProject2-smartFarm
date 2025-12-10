import {useNavigate} from "react-router-dom";
import {useState} from "react";

function MyPageEdit() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    loginId: "sayjoy97",
    name: "장세종",
    userAddr: "경남 통영시",
    email: "sayjoy97@gmail.com",
    phoneNumber: "010-8661-6470",
    novaSerialNumber: ["NOVA-2000", "NOVA-2001"],
  });

  const [editData, setEditData] = useState({...userData, password: ""});
  const [newSerial, setNewSerial] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const correctPassword = "1234";

  /** 비밀번호 확인 */
  const handlePasswordCheck = () => {
    if (passwordInput === correctPassword) {
      setShowPasswordModal(false);
    } else {
      alert("비밀번호가 틀렸습니다.");
      setPasswordInput("");
    }
  };

  /** 저장 */
  const handleSave = () => {
    const updated = {...editData};
    if (!editData.password) delete updated.password;

    setUserData(updated);
    alert("정보가 수정되었습니다.");
    navigate("/mypage");
  };

  /** 시리얼 추가 */
  const handleSerialAdd = () => {
    if (!newSerial.trim()) {
      alert("시리얼 번호를 입력해주세요.");
      return;
    }
    setEditData({
      ...editData,
      novaSerialNumber: [...editData.novaSerialNumber, newSerial.trim()],
    });
    setNewSerial("");
  };

  /** 시리얼 삭제 */
  const handleSerialRemove = (index) => {
    const updated = editData.novaSerialNumber.filter((_, i) => i !== index);
    setEditData({...editData, novaSerialNumber: updated});
  };

  return (
    <div className="edit-wrapper">
      {/* 비밀번호 모달 */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">비밀번호 확인</h2>

            <input
              className="modal-input"
              type="password"
              placeholder="비밀번호 입력"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handlePasswordCheck()}
              autoFocus
            />

            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => navigate("/mypage")}>
                취소
              </button>
              <button className="modal-confirm" onClick={handlePasswordCheck}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 폼 */}
      {!showPasswordModal && (
        <div className="edit-form">
          <h1 className="edit-title">정보 수정</h1>

          <div className="edit-field">
            <div className="edit-label">아이디 (수정 불가)</div>
            <div className="info-value-readonly">{editData.loginId}</div>
          </div>

          <div className="edit-field">
            <div className="edit-label">이름</div>
            <input
              className="edit-input"
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
            />
          </div>

          <div className="edit-field">
            <div className="edit-label">주소</div>
            <input
              className="edit-input"
              value={editData.userAddr}
              onChange={(e) => setEditData({...editData, userAddr: e.target.value})}
            />
          </div>

          <div className="edit-field">
            <div className="edit-label">이메일</div>
            <input
              className="edit-input"
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({...editData, email: e.target.value})}
            />
          </div>

          <div className="edit-field">
            <div className="edit-label">전화번호</div>
            <input
              className="edit-input"
              type="tel"
              value={editData.phoneNumber}
              onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
            />
          </div>

          <div className="edit-field">
            <div className="edit-label">비밀번호 변경 (선택사항)</div>
            <input
              className="edit-input"
              type="password"
              placeholder="새 비밀번호 입력"
              value={editData.password}
              onChange={(e) => setEditData({...editData, password: e.target.value})}
            />
          </div>

          <div className="edit-field">
            <div className="edit-label">NOVA 시리얼 번호</div>

            <div className="serial-list">
              {editData.novaSerialNumber.map((serial, index) => (
                <div key={index} className="serial-item">
                  <span>{serial}</span>
                  <button className="serial-delete-btn" onClick={() => handleSerialRemove(index)}>
                    삭제
                  </button>
                </div>
              ))}
            </div>

            <div className="add-serial-box">
              <input
                className="add-serial-input"
                placeholder="새 시리얼 번호 입력"
                value={newSerial}
                onChange={(e) => setNewSerial(e.target.value)}
              />

              <button className="add-serial-btn" onClick={handleSerialAdd}>
                추가
              </button>
            </div>
          </div>

          <div className="edit-buttons">
            <button className="edit-cancel-btn" onClick={() => navigate("/mypage")}>
              취소
            </button>
            <button className="edit-save-btn" onClick={handleSave}>
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyPageEdit;
