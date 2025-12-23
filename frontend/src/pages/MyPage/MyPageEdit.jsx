import {useNavigate, useOutletContext} from "react-router-dom";
import {useEffect, useState} from "react";
import "./MyPage.css"; // 기존 CSS 유지
import {updateUserInfo, myPageCheckPassword} from "../../api/mypage/mypageAPI";

function MyPageEdit() {
  const navigate = useNavigate();
  const {userInfo, setUserInfo, novaList, setNovaList} = useOutletContext();

  // 🔹 사용자 정보 (usersResponseDTO 그대로)
  const [editUser, setEditUser] = useState(null);

  // 🔹 NOVA 목록 (novaResponseDTOList 그대로)
  const [editNovaList, setEditNovaList] = useState([]);

  const [newNovaList, setNewNovaList] = useState("");

  // 🔹 비밀번호 확인 모달
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordCheckLoading, setPasswordCheckLoading] = useState(false);

  /** 부모에서 받은 API 데이터 그대로 복사 */
  useEffect(() => {
    if (!userInfo) return;

    setEditUser(userInfo);
    setEditNovaList(
      novaList.map((nova) => ({
        ...nova,
        status: "default",
      }))
    );
  }, [userInfo, novaList]);

  /** 비밀번호 확인 */
  const handlePasswordCheck = async () => {
    if (!passwordInput.trim()) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    try {
      setPasswordCheckLoading(true);
      const response = await myPageCheckPassword({
        userId: editUser.userId,
        password: passwordInput,
      });
      if (response.data === true) {
        setShowPasswordModal(false); // 확인 성공 시 폼 보여주기
      } else {
        alert("비밀번호가 틀렸습니다.");
        setPasswordInput("");
      }
    } catch (error) {
      console.log(error);
      alert("비밀번호 확인 중 오류가 발생했습니다.");
    } finally {
      setPasswordCheckLoading(false);
    }
  };

  /** NOVA 시리얼 추가 */
  const handleSerialAdd = () => {
    if (!newNovaList.trim()) {
      alert("시리얼 번호를 입력해주세요.");
      return;
    }

    setEditNovaList((prev) => [
      ...prev,
      {
        novaId: null,
        userId: editUser.userId,
        novaSerialNumber: newNovaList.trim(),
        status: "create",
      },
    ]);

    setNewNovaList("");
  };

  /** NOVA 시리얼 삭제 (실제 삭제 ❌ → status만 변경) */
  const handleSerialRemove = (index) => {
    setEditNovaList((prev) =>
      prev.map((nova, i) => (i === index ? {...nova, status: "delete"} : nova))
    );
  };

  /** 저장 */
  const handleSave = async () => {
    const editUserInfo = {
      usersRequestDTO: editUser,
      novaRequestDTOList: editNovaList,
    };

    await updateUserInfo(editUserInfo);

    // ✅ 부모 userInfo 수정
    setUserInfo((prev) => ({
      ...prev,
      ...editUser,
    }));

    // ✅ 부모 novaList 수정 (delete 제외)
    setNovaList(editNovaList.filter((nova) => nova.status !== "delete"));

    alert("정보가 수정되었습니다.");
    navigate("/mypage");
  };

  return (
    <div className="edit-wrapper">
      {/* ================= 비밀번호 모달 ================= */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">비밀번호 확인</h2>

            <input
              className="modal-input"
              type="password"
              placeholder="비밀번호 입력"
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setEditUser({...editUser, password: e.target.value});
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordCheck()}
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

      {/* ================= 수정 폼 ================= */}
      {!showPasswordModal && (
        <div className="edit-form">
          <h1 className="edit-title">정보 수정</h1>

          {/* 아이디 */}
          <div className="edit-field">
            <div className="edit-label">아이디 (수정 불가)</div>
            <div className="info-value-readonly">{editUser.loginId}</div>
          </div>

          {/* 비밀번호 변경 */}
          <div className="edit-field">
            <div className="edit-label">비밀번호 변경 (선택)</div>
            <input
              className="edit-input"
              type="password"
              placeholder="새 비밀번호 입력"
              value={editUser.password || ""}
              onChange={(e) => setEditUser({...editUser, password: e.target.value})}
            />
          </div>

          {/* 이름 */}
          <div className="edit-field">
            <div className="edit-label">이름</div>
            <input
              className="edit-input"
              value={editUser.name}
              onChange={(e) => setEditUser({...editUser, name: e.target.value})}
            />
          </div>

          {/* 전화번호 */}
          <div className="edit-field">
            <div className="edit-label">전화번호</div>
            <input
              className="edit-input"
              type="tel"
              value={editUser.phoneNumber}
              onChange={(e) => setEditUser({...editUser, phoneNumber: e.target.value})}
            />
          </div>

          {/* 이메일 */}
          <div className="edit-field">
            <div className="edit-label">이메일</div>
            <input
              className="edit-input"
              type="email"
              value={editUser.email}
              onChange={(e) => setEditUser({...editUser, email: e.target.value})}
            />
          </div>

          {/* 우편번호 */}
          <div className="edit-field">
            <div className="edit-label">우편번호</div>
            <input
              className="edit-input"
              value={editUser.postalCode}
              onChange={(e) => setEditUser({...editUser, postalCode: e.target.value})}
            />
          </div>

          {/* 기본주소 */}
          <div className="edit-field">
            <div className="edit-label">기본주소</div>
            <input
              className="edit-input"
              value={editUser.address}
              onChange={(e) => setEditUser({...editUser, address: e.target.value})}
            />
          </div>

          {/* 상세주소 */}
          <div className="edit-field">
            <div className="edit-label">상세주소</div>
            <input
              className="edit-input"
              value={editUser.addressDetail}
              onChange={(e) => setEditUser({...editUser, addressDetail: e.target.value})}
            />
          </div>

          {/* NOVA 시리얼 */}
          <div className="edit-field">
            <div className="edit-label">NOVA 시리얼 번호</div>

            <div className="serial-list">
              {editNovaList
                .filter((nova) => nova.status !== "delete")
                .map((nova, index) => (
                  <div key={index} className="serial-item">
                    <span>{nova.novaSerialNumber}</span>
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
                value={newNovaList}
                onChange={(e) => setNewNovaList(e.target.value)}
              />
              <button className="add-serial-btn" onClick={handleSerialAdd}>
                추가
              </button>
            </div>
          </div>

          {/* 버튼 */}
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
