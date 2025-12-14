import { useEffect, useState } from "react";
import "./PlantManage.css";
import PlantModal from "./PlantModal";
import farmFullData from "../../api/mockDatas/farmFullData";
import { useAuth } from "../../api/auth/AuthContext";
import { FarmGrid } from "../../components/PlantManage/FarmGrid";
import { FarmCreateModal } from "../../components/PlantManage/FarmCreateModal";
import TimeLapseModal from "../../components/TimeLapse/TimeLapseModal";
import { TimeCreateModal } from "../../components/TimeLapse/TimeCreateModal";
import { getFarmList, getNovaList } from "../../api/PlantManage/plantsAPI";

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

  // API 호출 -> 유저 소유의 Nova List 호출
  useEffect(() => {
    const fetchInitData = async () => {
      if (!user) return;

      try {
        // Nova 리스트 가져오기
        const novaData = await getNovaList(user.userId);
        setNovaList(novaData); // 화면 렌더링을 위해 State 업데이트 요청
        // console.log("Nova List:", novaData);

        // 받아온 'novaData' 변수를 직접 사용하여 조건 검사
        if (novaData && novaData.length > 0) {
          setSelectedNova(novaData[0]);

          // 첫 번째 기기의 Farm 리스트를 가져와 팜카드로 보여주기
          const farmData = await getFarmList(novaData[0].novaId);
          setFarmList(farmData);
          console.log("Farm List:", farmData);
        }
      } catch (e) {
        console.error("데이터 로딩 중 에러:", e);
      }
    };

    fetchInitData();
  }, [user]);

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
  const controlNextStep = (farmData) => {
    setNewFarm(farmData);
    setIsFarmCreateOpen(false);
    setIsTimeLapseCreateOpen(true);
  };

  // 팜 생성 처리
  const handleCreateFarm = (farmData) => {
    const newFarmData = {
      slot: farmList.length + 1,
      ...farmData,
    };
    setFarmList([...farmList, newFarmData]);
    setIsFarmCreateOpen(false);
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
        onSelectFarm={() => setSelectedFarm(farmFullData)}
        onTimeLapse={setTimeLapseDetail}
      />
      {selectedFarm && (
        <PlantModal data={selectedFarm} onClose={() => setSelectedFarm(null)} />
      )}

      {isFarmCreateOpen && (
        <FarmCreateModal
          onClose={() => setIsFarmCreateOpen(false)}
          onCreate={controlNextStep}
        />
      )}

      {isTimeLapseCreateOpen && (
        <TimeCreateModal
          farm={newFarm}
          onClose={() => setIsTimeLapseCreateOpen(false)}
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
