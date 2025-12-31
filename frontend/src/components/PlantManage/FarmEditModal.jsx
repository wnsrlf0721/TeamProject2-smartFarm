import React, { useState, useEffect } from "react";
import styles from "./FarmCreateModal.module.css"; // 기존 스타일 재사용
import { RangeSlider } from "../RangeSlider.jsx";
import { getPresetStepList } from "../../api/PlantManage/plantsAPI.jsx";

// --- [Icons] Simple SVG Icons (기존과 동일) ---
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

// 기본 환경 설정값 (단계 추가 시 사용)
const DEFAULT_ENV = {
  temp: { min: 20, max: 25 },
  humidity: { min: 50, max: 70 },
  co2: { min: 400, max: 800 },
  soilMoisture: { min: 40, max: 60 },
  lightPower: { min: 50, max: 80 },
  waterLevel: 3,
};

export const FarmEditModal = ({ farm, onClose, onUpdate }) => {
  // --- State 관리 ---
  const [farmName, setFarmName] = useState("");
  const [stepList, setStepList] = useState([]);
  const [stepOpen, setStepOpen] = useState([]); // 아코디언 상태

  // 이미지 관련
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 초기 데이터 로딩 (전달받은 farm 객체로 초기화)
  useEffect(() => {
    if (farm) {
      setFarmName(farm.farmName);

      // 이미지 초기화: 서버 URL이 있으면 보여주고, 없으면 기본값
      const serverImageUrl = farm.presetStep?.preset?.presetImageUrl
        ? "http://localhost:8080" + farm.presetStep.preset.presetImageUrl
        : null;
      setPreviewUrl(serverImageUrl);

      // 단계 리스트 초기화
      const fetchStepList = async () => {
        try {
          const presetId = farm.presetStep?.preset?.presetId;

          if (presetId) {
            // await를 사용하여 데이터를 받아올 때까지 기다림
            const list = await getPresetStepList(presetId);
            setStepList(list);
          }
        } catch (error) {
          console.error("단계 리스트를 불러오는데 실패했습니다:", error);
        }
      };
      fetchStepList();
    }
  }, [farm]);

  // 핸들러: 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // 새 이미지 미리보기
    }
  };

  // 핸들러: 단계 추가
  const addGrowthStage = () => {
    const newStage = {
      growthStep: stepList.length + 1,
      preset: stepList[0]?.preset || null, // 기존 프리셋 정보 복사
      periodDays: 10,
      ...DEFAULT_ENV,
    };
    setStepList([...stepList, newStage]);
    setStepOpen([...stepOpen, newStage.growthStep]); // 추가된 단계 열기
  };

  // 핸들러: 단계 삭제
  const removeGrowthStage = (id) => {
    if (stepList.length > 1) {
      setStepList(stepList.filter((stage) => stage.stepId !== id));
    } else {
      alert("최소 하나의 성장 단계는 필요합니다.");
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

  // 핸들러: 환경변수 업데이트 (RangeSlider)
  const updateEnvironment = (growthStep, key, min, max) => {
    setStepList(
      stepList.map((stage) =>
        stage.growthStep === growthStep
          ? {
              ...stage,
              [key]: { min, max },
            }
          : stage
      )
    );
  };

  // 핸들러: 단계 이름/일수 변경
  const updateStageName = (growthStep, e) => {
    const { name, value } = e.target;
    const onlyNumbers = value.replace(/[^0-9]/g, "");
    setStepList(stepList.map((stage) => (stage.growthStep === growthStep ? { ...stage, [name]: onlyNumbers } : stage)));
  };

  // 핸들러: 수정사항 저장
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!farmName) return alert("팜 이름을 입력해주세요.");
    const farmId = farm.farmId;
    const payload = {
      farmName: farmName,
      stepList: stepList.map((step) => ({
        stepId: step.stepId, // 기존 단계 수정용 ID
        growthStep: step.growthStep,
        periodDays: step.periodDays,
        // [중요] 백엔드에서 신규 단계 생성 시 presetId가 필요하므로 preset 객체 포함
        preset: step.preset,

        // 환경 설정 값들
        temp: step.temp,
        humidity: step.humidity,
        lightPower: step.lightPower,
        co2: step.co2,
        soilMoisture: step.soilMoisture,
      })),
    };

    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    formData.append("request", jsonBlob);

    // 이미지가 변경된 경우에만 추가
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    console.log("Update Payload:", payload);

    // [중요] 부모 컴포넌트에 formData와 farmId를 분리해서 전달
    onUpdate(farmId, formData);
  };

  // 프리셋 정보 (읽기 전용 표시용)
  const currentPresetName = farm?.presetStep?.preset?.presetName || "알 수 없음";
  const currentPlantType = farm?.presetStep?.preset?.plantType || "알 수 없음";

  return (
    <div className={styles["modal-overlay"]} onClick={onClose}>
      <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className={styles["modal-header"]}>
          <div className={styles["header-left"]}>
            <div className={styles["icon-box"]} style={{ backgroundColor: "#ca8a04" }}>
              {/* 수정 모드라 아이콘 배경색 살짝 변경 (선택사항) */}
              <Icons.Sprout />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>팜 정보 수정</h2>
          </div>
          <button className={styles["close-btn"]} onClick={onClose}>
            <Icons.Close />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles["modal-body"]}>
            {/* 1. 기본 정보 섹션 */}
            <div className={styles["form-section"]}>
              <label className={styles["label"]}>기본 정보</label>

              {/* 팜 이름 (수정 가능) */}
              <div style={{ marginTop: "20px" }}>
                <label className={styles["label"]}>팜 이름</label>
                <input
                  className={styles["input-field"]}
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                />
              </div>

              {/* 프리셋 정보 (수정 불가 - 읽기 전용) */}
              <div style={{ marginTop: "20px" }}>
                <label className={styles["label"]}>현재 적용된 프리셋 (변경 불가)</label>
                <div
                  className={styles["input-field"]}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "#94a3b8",
                    cursor: "not-allowed",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{currentPresetName}</span>
                  <span>{currentPlantType}</span>
                </div>
              </div>

              {/* 이미지 수정 영역 */}
              <div style={{ marginTop: "20px" }}>
                <div className={styles["section-title"]}>대표 이미지</div>
                <div
                  className={styles["modal-content"]}
                  style={{
                    padding: "10px",
                    alignItems: "flex-start",
                    width: "100%",
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <input
                    type="file"
                    id="file-upload-edit"
                    className={styles["hidden-input"]} // 스타일이 없다면 style={{display:'none'}} 추가 필요
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <div style={{ display: "flex", gap: "20px", alignItems: "end" }}>
                    {/* 미리보기 이미지 */}
                    <div
                      style={{
                        width: "150px",
                        height: "100px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid #475569",
                        background: "#1e293b",
                      }}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Farm Preview"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#64748b",
                            fontSize: "0.8rem",
                          }}
                        >
                          이미지 없음
                        </div>
                      )}
                    </div>

                    {/* 파일 선택 버튼 */}
                    <label
                      htmlFor="file-upload-edit"
                      className={styles["change-btn"]}
                      style={{
                        background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                      }}
                    >
                      이미지 변경
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 성장 단계 설정 (수정 가능) */}
            <div>
              <div className={styles["stage-header-row"]}>
                <div className={styles["section-title"]} style={{ margin: 0 }}>
                  성장 단계 상세 설정
                </div>
                <button type="button" className={styles["add-stage-btn"]} onClick={addGrowthStage}>
                  <Icons.Plus /> 단계 추가
                </button>
              </div>

              {stepList.map((stage) => (
                <div key={stage.growthStep} className={styles["stage-card"]}>
                  <div className={styles["stage-top"]} onClick={() => toggleStage(stage.growthStep)}>
                    <div>
                      <input
                        className={styles["stage-name-edit"]}
                        name="growthStep"
                        value={stage.growthStep}
                        type="text"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStageName(stage.growthStep, e)}
                      />
                      <span>단계, </span>
                      <span> 소요 일 수: </span>
                      <input
                        className={styles["stage-name-edit"]}
                        name="periodDays"
                        value={stage.periodDays}
                        type="text"
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStageName(stage.growthStep, e)}
                      />
                    </div>

                    <div style={{ alignItems: "center", gap: "10px", display: "flex" }}>
                      {stepList.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeGrowthStage(stage.growthStep);
                          }}
                          style={{ background: "none", border: "none", cursor: "pointer" }}
                        >
                          <Icons.Trash />
                        </button>
                      )}
                      {stepOpen.includes(stage.growthStep) ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                    </div>
                  </div>

                  {stepOpen.includes(stage.growthStep) && (
                    <div className={styles["stage-controls"]}>
                      {/* RangeSliders Reuse */}
                      <RangeSlider
                        label="온도"
                        min={0}
                        max={50}
                        step={1}
                        unit="°C"
                        minValue={stage.temp?.min || 0}
                        maxValue={stage.temp?.max || 50}
                        onChange={(min, max) => updateEnvironment(stage.growthStep, "temp", min, max)}
                      />
                      <RangeSlider
                        label="습도"
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        minValue={stage.humidity?.min || 0}
                        maxValue={stage.humidity?.max || 100}
                        onChange={(min, max) => updateEnvironment(stage.growthStep, "humidity", min, max)}
                      />
                      <RangeSlider
                        label="CO2"
                        min={0}
                        max={2000}
                        step={50}
                        unit="ppm"
                        minValue={stage.co2?.min || 0}
                        maxValue={stage.co2?.max || 2000}
                        onChange={(min, max) => updateEnvironment(stage.growthStep, "co2", min, max)}
                      />
                      <RangeSlider
                        label="토양수분"
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        minValue={stage.soilMoisture?.min || 0}
                        maxValue={stage.soilMoisture?.max || 100}
                        onChange={(min, max) => updateEnvironment(stage.growthStep, "soilMoisture", min, max)}
                      />
                      <RangeSlider
                        label="조도"
                        min={0}
                        max={100}
                        step={1}
                        unit="%"
                        minValue={stage.lightPower?.min || 0}
                        maxValue={stage.lightPower?.max || 100}
                        onChange={(min, max) => updateEnvironment(stage.growthStep, "lightPower", min, max)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 푸터 */}
          <div className={styles["modal-footer"]}>
            <button type="button" className={styles["btn-cancel"]} onClick={onClose}>
              취소
            </button>
            <button type="submit" className={styles["btn-submit"]}>
              변경
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
