import React, { useState, useEffect } from "react";
import styles from "./FarmCreateModal.module.css";
import { RangeSlider } from "../RangeSlider.jsx";
import { getPresetList, getPresetStepList } from "../../api/PlantManage/plantsAPI.jsx";

// --- [Icons] Simple SVG Icons to replace Lucide ---
const Icons = {
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Sprout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.2.4-4.8-.4-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.9z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1.7-1.3 2.9-3.3 3-5.5-3.3-1.1-5.3-.1-6.2 2.9z" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  ),
  ChevronUp: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  ),
};

// --- 프리셋 생성 시 나오는 트랙바 초기 데이터 값 ---
const DEFAULT_ENV = {
  temp: { min: 20, max: 25 },
  humidity: { min: 50, max: 70 },
  co2: { min: 400, max: 800 },
  soilMoisture: { min: 40, max: 60 },
  lightPower: { min: 50, max: 80 },
  waterLevel: 3,
};

// --- [Main Component] ---
export const FarmCreateModal = ({ user, nova, slot, onClose, onCreate }) => {
  const [farmName, setFarmName] = useState(""); // 입력한 팜 이름
  const [presetList, setPresetList] = useState([]);

  // 프리셋 관련 state
  const [selectedPreset, setSelectedPreset] = useState(null); // 기존 프리셋 선택
  const [isCreatingNew, setIsCreatingNew] = useState(false); // 새 프리셋 생성
  const [isOpen, setIsOpen] = useState(false); //프리셋 선택 list를 열었는지 여부

  const [newPlantName, setNewPlantName] = useState(""); //new 식물 종 설정
  const [newPresetName, setNewPresetName] = useState(""); //new 프리셋 설정

  //팜 생성 대표 이미지
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기용

  // // API 호출 -> 유저 소유의 Preset List 호출
  useEffect(() => {
    const fetchInitData = async () => {
      if (!user) return;

      try {
        // Preset 리스트 가져오기
        const presetData = await getPresetList(user.userId);
        console.log(presetData);
        setPresetList(presetData); // 화면 렌더링을 위해 State 업데이트 요청
      } catch (e) {
        console.error("데이터 로딩 중 에러:", e);
      }
    };

    fetchInitData();
  }, [user]);

  // 이미지 파일 선택 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기 생성
    }
  };

  // 성장 단계 데이터(단계 별 센서 범위)
  const [stepList, setStepList] = useState([]);
  const [stepOpen, setStepOpen] = useState([stepList.stepId]);

  // 핸들러: 기존 프리셋 선택
  const handleSelectPreset = async (preset) => {
    setSelectedPreset(preset);
    try {
      // Preset 리스트 가져오기
      const presetStep = await getPresetStepList(preset.presetId);
      console.log(presetStep);
      setStepList(presetStep);
      // 첫 번째 단계 열기 (stepId 사용)
      if (presetStep.length > 0) {
        setStepOpen([presetStep[0].stepId]);
      }
    } catch (e) {
      console.error("데이터 로딩 중 에러:", e);
      setStepList([]);
    }

    setIsOpen(false); // 리스트 닫기
    setIsCreatingNew(false);
  };

  // 핸들러: 새 프리셋 생성
  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedPreset(null);

    // 초기화
    const newStage = {
      stepId: 1,
      growthStep: 1,
      periodDays: 10,
      ...DEFAULT_ENV,
    };

    setStepList([newStage]); //초기화 데이터 적용
  };

  // 핸들러: 단계 추가
  const addGrowthStage = () => {
    const newStage = {
      stepId: stepList.length + 1,
      growthStep: stepList.length + 1,
      periodDays: 10,
      ...DEFAULT_ENV,
    };
    setStepList([...stepList, newStage]);
  };

  // 핸들러: 단계 삭제
  const removeGrowthStage = (id) => {
    if (stepList.length > 1) {
      setStepList(stepList.filter((stage) => stage.stepId !== id));
    }
  };

  // 핸들러: 아코디언 토글
  const toggleStage = (id) => {
    if (stepOpen.includes(id)) {
      setStepOpen(stepOpen.filter((sid) => sid !== id));
    } else {
      setStepOpen([...stepOpen, id]);
    }
  };

  // 핸들러: 환경변수(dht, light ...etc) 업데이트
  const updateEnvironment = (stageId, key, min, max) => {
    setStepList(
      stepList.map((stage) =>
        stage.stepId === stageId
          ? {
              ...stage,
              [key]: { min, max },
            }
          : stage
      )
    );
  };

  // 핸들러: 단계 이름 변경
  const updateStageName = (stageId, e) => {
    const { name, value } = e.target;

    const onlyNumbers = value.replace(/[^0-9]/g, "");
    setStepList(stepList.map((stage) => (stage.stepId === stageId ? { ...stage, [name]: onlyNumbers } : stage)));
  };
  // 팜 생성 시 처리되는 메서드
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!farmName) return alert("팜 이름을 입력해주세요.");
    if (!selectedPreset && !isCreatingNew) return alert("프리셋을 선택해주세요.");

    const payload = {
      farmName,
      slot,
      novaId: nova.novaId,
      user: nova.user,

      isNewPreset: isCreatingNew,

      // ✅ 기존 프리셋일 경우 selectedPreset에서 presetId 사용
      existingPresetId: !isCreatingNew ? selectedPreset?.presetId : null,

      // ✅ 새 프리셋일 때만 값 전달
      plantType: isCreatingNew ? newPlantName : null,
      presetName: isCreatingNew ? newPresetName : null,
      stepList: isCreatingNew ? stepList : [],
    };

    // 2. FormData 생성 및 데이터 포장
    const formData = new FormData();
    // 일반 JSON 데이터 추가
    const jsonBlob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    formData.append("request", jsonBlob);
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    console.log("Submit FormData:", formData);
    onCreate(formData);
  };

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={styles["modal-header"]}>
          <div className={styles["header-left"]}>
            <Icons.Sprout />
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>새로운 팜 생성</h2>
          </div>
          <button className={styles["close-btn"]} onClick={onClose}>
            <Icons.Close />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* 바디 */}
          <div className={styles["modal-body"]}>
            {/* 기본 정보 */}
            <div className={styles["form-section"]}>
              <label className={styles["label"]}>기본 정보</label>
              <div>
                {/* 팜 이름 입력*/}
                <div style={{ marginTop: "20px" }}>
                  <label className={styles["label"]}>팜 이름</label>
                  <input
                    className={styles["input-field"]}
                    placeholder="예: 상추 재배 A동"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                  />
                </div>
                {/* 프리셋 선택 영역 */}
                <div
                  style={{
                    marginTop: "20px",
                    position: "relative",
                  }}
                >
                  {/* relative: 리스트 위치 기준점 */}
                  <label className={styles["label"]}>식물 종류 프리셋 선택</label>
                  {/* 새로운 식물 만들기 (직접 입력) */}
                  {isCreatingNew ? (
                    <div>
                      <div className={styles["preset-selected-box"]}>
                        <input
                          className={styles["input-field"]}
                          placeholder="원하는 식물 종 입력"
                          value={newPlantName}
                          autoFocus
                          onChange={(e) => setNewPlantName(e.target.value)}
                        />
                        <input
                          className={styles["input-field"]}
                          placeholder="새 프리셋 이름 입력"
                          value={newPresetName}
                          autoFocus
                          onChange={(e) => setNewPresetName(e.target.value)}
                        />
                        <button
                          type="button"
                          className={styles["change-btn"]}
                          onClick={() => {
                            setIsCreatingNew(false);
                            setNewPlantName("");
                          }}
                        >
                          취소
                        </button>
                      </div>
                      <div>
                        <div className={styles["section-title"]}>식물 사진 업로드</div>
                        <div className={styles["modal-content"]}>
                          <input
                            type="file"
                            className={styles["hidden-input"]}
                            id="file-upload"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                          {/* 이미지 출력 영역 */}
                          <div style={{marginTop: "20px"}}>
                            {previewUrl ? (
                              <div>
                                <p>미리보기:</p>
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  style={{width: "300px", opacity: 0.5}}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 드롭다운 선택 모드 */
                    <>
                      {/* 초기 클릭 시 리스트 토글 */}
                      <div className={styles["preset-selector-trigger"]} onClick={() => setIsOpen(!isOpen)}>
                        {selectedPreset ? (
                          /* 선택된 프리셋 정보 표시 */
                          <div className={styles["preset-item"]}>
                            <div
                              style={{
                                fontWeight: "bold",
                                fontSize: "1rem",
                              }}
                            >
                              {selectedPreset.presetName}
                            </div>
                            <div
                              style={{
                                fontSize: "0.85rem",
                                color: "#94a3b8",
                              }}
                            >
                              작성자: {selectedPreset.name}
                            </div>
                          </div>
                        ) : (
                          /* 선택 전 플레이스홀더 */
                          <span
                            style={{
                              color: "#94a3b8",
                            }}
                          >
                            저장된 프리셋을 선택하세요
                          </span>
                        )}
                        {/* 화살표 아이콘 (열림/닫힘 표시) */}
                        <span style={{ color: "#94a3b8" }}>{isOpen ? "▲" : "▼"}</span>
                      </div>

                      {/* 2. 드롭다운 리스트 (isOpen일 때만 보임) */}
                      {isOpen && (
                        <div className={styles["preset-list"]}>
                          {presetList.map((preset) => (
                            <div
                              key={preset.presetId}
                              className={styles["preset-item"]}
                              onClick={() => {
                                handleSelectPreset(preset); // 부모 상태 업데이트
                              }}
                              style={{
                                padding: "12px 16px",
                                borderBottom: "1px solid #f1f5f9",
                                cursor: "pointer",
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "1rem",
                                }}
                              >
                                {preset.presetName}
                              </div>
                              <div
                                style={{
                                  fontSize: "0.85rem",
                                  color: "#94a3b8",
                                }}
                              >
                                {`${preset.plantType}`}
                              </div>
                            </div>
                          ))}

                          {/* 리스트 맨 아래 '새로 만들기' 버튼 */}
                          <button
                            type="button"
                            className={styles["create-new-btn"]}
                            onClick={() => {
                              handleCreateNew(); // 새로 만들기 모드로 진입
                              setIsOpen(false); // 리스트 닫기
                            }}
                          >
                            + 새로운 식물 종류 만들기
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 성장 단계 설정 (트랙바) */}
            {(selectedPreset || isCreatingNew) && (
              <div>
                <div className={styles["stage-header-row"]}>
                  <div className={styles["section-title"]} style={{ margin: 0 }}>
                    성장 단계 설정
                  </div>
                  <button type="button" className={styles["add-stage-btn"]} onClick={addGrowthStage}>
                    <Icons.Plus /> 단계 추가
                  </button>
                </div>

                {stepList.map((stage) => (
                  <div key={stage.stepId} className={styles["stage-card"]}>
                    <div className={styles["stage-top"]} onClick={() => toggleStage(stage.stepId)}>
                      <div>
                        <input
                          className={styles["stage-name-edit"]}
                          name="growthStep"
                          value={stage.growthStep}
                          type="text"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateStageName(stage.stepId, e)}
                        />
                        <span>단계, </span>

                        <span> 소요 일 수: </span>
                        <input
                          className={styles["stage-name-edit"]}
                          name="periodDays"
                          value={stage.periodDays}
                          type="text"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateStageName(stage.stepId, e)}
                        />
                      </div>

                      <div
                        style={{
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {stepList.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeGrowthStage(stage.stepId);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <Icons.Trash />
                          </button>
                        )}
                        {stepOpen.includes(stage.stepId) ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                      </div>
                    </div>

                    {stepOpen.includes(stage.stepId) && (
                      <div className={styles["stage-controls"]}>
                        <RangeSlider
                          label="온도"
                          min={0}
                          max={50}
                          step={1}
                          unit="°C"
                          minValue={stage.temp.min}
                          maxValue={stage.temp.max}
                          onChange={(min, max) => updateEnvironment(stage.stepId, "temp", min, max)}
                        />

                        <RangeSlider
                          label="습도"
                          min={0}
                          max={100}
                          step={1}
                          unit="%"
                          minValue={stage.humidity.min}
                          maxValue={stage.humidity.max}
                          onChange={(min, max) => updateEnvironment(stage.stepId, "humidity", min, max)}
                        />

                        <RangeSlider
                          label="CO2"
                          min={0}
                          max={2000}
                          step={50}
                          unit="ppm"
                          minValue={stage.co2.min}
                          maxValue={stage.co2.max}
                          onChange={(min, max) => updateEnvironment(stage.stepId, "co2", min, max)}
                        />

                        <RangeSlider
                          label="토양수분"
                          min={0}
                          max={100}
                          step={1}
                          unit="%"
                          minValue={stage.soilMoisture.min}
                          maxValue={stage.soilMoisture.max}
                          onChange={(min, max) => updateEnvironment(stage.stepId, "soilMoisture", min, max)}
                        />

                        <RangeSlider
                          label="조도"
                          min={0}
                          max={100}
                          step={1}
                          unit="%"
                          minValue={stage.lightPower.min}
                          maxValue={stage.lightPower.max}
                          onChange={(min, max) => updateEnvironment(stage.stepId, "lightPower", min, max)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className={styles["modal-footer"]}>
            <button type="button" className={styles["btn-cancel"]} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles["btn-submit"]}>
              타임랩스 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
