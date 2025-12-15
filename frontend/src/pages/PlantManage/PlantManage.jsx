import { useEffect, useState, useCallback } from "react";
import "./PlantManage.css";
import PlantModal from "./PlantModal";
import farmFullData from "../../api/mockDatas/farmFullData";
import { useAuth } from "../../api/auth/AuthContext";
import { FarmGrid } from "../../components/PlantManage/FarmGrid";
import { FarmCreateModal } from "../../components/PlantManage/FarmCreateModal";
import TimeLapseModal from "../../components/TimeLapse/TimeLapseModal";
import { TimeCreateModal } from "../../components/TimeLapse/TimeCreateModal";
import {
  createFarm,
  getFarmList,
  getNovaList,
} from "../../api/PlantManage/plantsAPI";

function PlantManage() {
  // 🔥 로그인 정보 가져오기
  const { user } = useAuth();

  // 페이지에 보여지는 Nova List 정보
  const [novaList, setNovaList] = useState([]);
  const [selectedNova, setSelectedNova] = useState(null);

  // 페이지에 보여지는 Farm List 정보
  const [farmList, setFarmList] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // 팜 생성 간 저장되는 정보
  const [newFarm, setNewFarm] = useState(null);
  const [newSlot, setNewSlot] = useState(null);

  //모달 창 관련 State
  const [isFarmCreateOpen, setIsFarmCreateOpen] = useState(false);
  const [isTimeLapseCreateOpen, setIsTimeLapseCreateOpen] = useState(false);
  const [timeLapseDetail, setTimeLapseDetail] = useState(null);

  // 로그인 안 된 경우 → 안내 UI만 보여줌 (기존 코드 영향 없음)
  if (!user) {
    return (
      <div className="need-login-wrap">
        <h1>내 식물 관리</h1>
        <div className="need-login-box">
          <h2>로그인이 필요합니다</h2>
          <p>내 식물 관리는 로그인한 사용자만 이용할 수 있어요.</p>
          <button
            className="login-go-btn"
            onClick={() => (window.location.href = "/login")}
          >
            로그인 하러 가기 →
          </button>
        </div>
      </div>
    );
  }

  const fetchInitData = useCallback(async () => {
    if (!user) return;

    try {
      console.log("데이터 갱신 시작...");

      // Nova 리스트 가져오기
      const novaData = await getNovaList(user.userId);
      setNovaList(novaData);

      let targetNova = selectedNova; // 현재 선택된 것 유지

      // 만약 선택된 게 없거나(첫 로드), 리스트가 갱신되어 기존 선택이 유효하지 않다면 첫 번째 선택
      if (!targetNova && novaData && novaData.length > 0) {
        targetNova = novaData[0];
        setSelectedNova(targetNova);
      }

      // 선택된 기기가 있다면 그 기기의 팜 리스트 갱신
      if (targetNova) {
        const farmData = await getFarmList(targetNova.novaId);
        setFarmList(farmData);
        console.log("Farm List 갱신 완료:", farmData);
      }
    } catch (e) {
      console.error("데이터 로딩 중 에러:", e);
    }
  }, [user, selectedNova]); // user나 selectedNova가 바뀔 때 함수 갱신

  // 2. 초기 렌더링 시 호출
  useEffect(() => {
    fetchInitData();
  }, [fetchInitData]); // fetchInitData가 변경될 때(즉, user가 바뀔 때) 실행됨

  const handleNovaChange = async (e) => {
    const selectedId = Number(e.target.value); // value는 문자열로 오므로 숫자로 변환
    const targetNova = novaList.find((nova) => nova.novaId === selectedId);

    setSelectedNova(targetNova);
    // console.log("선택된 Nova ID:", selectedId);
    // 추후 여기에 getFarmList(selectedId) 호출 추가
    const farmData = await getFarmList(selectedId);
    setFarmList(farmData);
    // console.log("Farm List:", farmData);
  };

  // 팜 생성 → 타임랩스 생성 연결
  const controlNextStep = async (formData) => {
    try {
      console.log(formData);
      const result = await createFarm(formData);
      console.log(result);
    } catch (e) {
      console.error(e);
    }
    setIsFarmCreateOpen(false);
    setIsTimeLapseCreateOpen(true);
  };

  // 팜 생성 처리
  const handleCreateFarm = (farmData) => {
    setIsFarmCreateOpen(false);
    fetchInitData();
  };

  return (
    <div className="plants-page">
      <h1>내 식물 관리</h1>
      <div className="nova-select-wrapper" style={{ marginBottom: "20px" }}>
        <label htmlFor="nova-select">🌱 관리할 기기 선택:</label>
        <select
          id="nova-select"
          className="nova-select-box"
          value={selectedNova ? selectedNova.novaId : ""}
          onChange={handleNovaChange}
        >
          {novaList.length === 0 ? (
            <option value="">등록된 기기가 없습니다</option>
          ) : (
            novaList.map((nova) => (
              <option key={nova.novaId} value={nova.novaId}>
                {nova.novaSerialNumber}
              </option>
            ))
          )}
        </select>
      </div>

      <FarmGrid
        farms={farmList}
        maxCards={4}
        onAddFarm={(slot) => {
          setIsFarmCreateOpen(true);
          setNewSlot(slot);
        }}
        onSelectFarm={(selected) => {
          // setSelectedFarm(selected);
          setSelectedFarm(farmFullData);
        }}
        onTimeLapse={setTimeLapseDetail}
      />
      {selectedFarm && (
        <PlantModal data={selectedFarm} onClose={() => setSelectedFarm(null)} />
      )}

      {isFarmCreateOpen && (
        <FarmCreateModal
          user={user}
          nova={selectedNova}
          slot={newSlot}
          onClose={() => setIsFarmCreateOpen(false)}
          onCreate={controlNextStep}
        />
      )}

      {isTimeLapseCreateOpen && (
        <TimeCreateModal
          farm={newFarm}
          onClose={() => {
            setIsTimeLapseCreateOpen(false);
            fetchInitData();
          }}
          onCreate={handleCreateFarm}
        />
      )}

      {timeLapseDetail && (
        <TimeLapseModal
          farm={timeLapseDetail}
          onClose={() => setTimeLapseDetail(null)}
        />
      )}
    </div>
  );
}

export default PlantManage;
