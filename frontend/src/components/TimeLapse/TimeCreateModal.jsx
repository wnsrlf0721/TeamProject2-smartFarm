import React, {useState, useMemo, useEffect, useRef} from "react";
import {Video, Film} from "lucide-react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {createPortal} from "react-dom";
import {timelapseCreate} from "../../api/timelapse/timelapseAPI";
import {getPresetStepList} from "../../api/PlantManage/plantsAPI";
import styles from "./TimeCreateModal.module.css";

const ItemTypes = {ICON: "icon"};

/* ===================== Draggable Icon ===================== */
function DraggableIcon({item, from, onClickMove}) {
  const [{isDragging}, drag] = useDrag({
    type: ItemTypes.ICON,
    item: {...item, from},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={styles.tm_icon_card}
      style={{opacity: isDragging ? 0.4 : 1}}
      onClick={() => onClickMove(item, from)}
    >
      {item.type === "video" ? <Video size={28} /> : <Film size={28} />}
      <span className={styles.tm_icon_label}>{item.label}</span>
    </div>
  );
}

/* ===================== DropZone ===================== */
function DropZone({children, acceptDrop}) {
  const [, drop] = useDrop({
    accept: ItemTypes.ICON,
    drop: (item) => acceptDrop(item),
  });
  return <div ref={drop}>{children}</div>;
}

/* ===================== Scroll Wrapper ===================== */
function ScrollWrapper({children}) {
  const [topFadeVisible, setTopFadeVisible] = useState(false);
  const [bottomFadeVisible, setBottomFadeVisible] = useState(true);
  const scrollRef = useRef();

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setTopFadeVisible(el.scrollTop > 0);
    setBottomFadeVisible(el.scrollTop + el.clientHeight < el.scrollHeight);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={styles.tm_scroll_wrapper}>
      {topFadeVisible && <div className={styles.tm_scroll_fade_top} />}
      <div ref={scrollRef} className={styles.tm_scroll_inner}>
        {children}
      </div>
      {bottomFadeVisible && <div className={styles.tm_scroll_fade_bottom} />}
    </div>
  );
}

/* ===================== Main Modal ===================== */
export const TimeCreateModal = ({farm, onClose}) => {
  const [availableList, setAvailableList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [videoSettings, setVideoSettings] = useState({});
  const [stepMap, setStepMap] = useState({});
  const [baseOrder, setBaseOrder] = useState([]);

  /* ===== preset_step 조회 (DB 기준) ===== */
  useEffect(() => {
    const presetId = farm?.presetStep?.preset?.presetId ?? null;
    if (!presetId) return;

    const fetchSteps = async () => {
      try {
        const stepList = await getPresetStepList(presetId);
        const map = {};
        stepList.forEach((step) => (map[step.stepId] = step));
        setStepMap(map);

        // 전체 영상 + 단계 영상 리스트 생성
        const list = [
          {id: 1, label: "전체 영상", type: "video"},
          ...stepList.map((step) => ({
            id: step.stepId,
            label: `${step.growthStep}단계`,
            type: "film",
          })),
        ];

        setAvailableList(list);
        // 순서 기준 저장 (전체 영상은 맨 앞)
        setBaseOrder(list.map((v) => v.id));
      } catch (e) {
        console.error("프리셋 스텝 조회 실패", e);
      }
    };

    fetchSteps();
  }, [farm?.presetStep?.presetId]);

  /* ===== 기본 설정 자동 생성 ===== */
  useEffect(() => {
    setVideoSettings((prev) => {
      const next = {...prev};
      const allStepIds = Object.keys(stepMap).map(Number);

      selectedList.forEach((item) => {
        if (!next[item.id]) {
          const periodDays =
            item.id === 1
              ? allStepIds.reduce(
                  (sum, id) => sum + (videoSettings[id]?.duration ?? stepMap[id]?.periodDays ?? 1),
                  0
                )
              : stepMap[item.id]?.periodDays ?? 1;

          next[item.id] = {
            presetStepId: item.id === 1 ? null : item.id,
            timelapseName: item.label,
            fps: 30,
            duration: periodDays,
            captureInterval: 0,
            resolution: "1920x1080",
            state: "PENDING",
          };
        }
      });
      return next;
    });
  }, [selectedList, stepMap]);

  /* ===== 단계별 영상 설정 변경 ===== */
  const handleSettingChange = (id, field, value) => {
    if (field === "duration" && id !== 1) {
      const periodDays = stepMap[id]?.periodDays ?? 1;
      // 최소: periodDays, 최대: periodDays * 2
      value = Math.max(periodDays, Math.min(value, periodDays * 2));
    }
    setVideoSettings((prev) => {
      const next = {...prev, [id]: {...prev[id], [field]: value}};

      // 전체 영상 duration 갱신
      const allStepIds = Object.keys(stepMap).map(Number);
      next[1] = {
        ...next[1],
        duration: allStepIds.reduce(
          (sum, stepId) => sum + (next[stepId]?.duration ?? stepMap[stepId]?.periodDays ?? 1),
          0
        ),
      };

      return next;
    });
  };

  /* ===== 순서 유지 함수 ===== */
  const sortByBaseOrder = (list) =>
    [...list].sort((a, b) => baseOrder.indexOf(a.id) - baseOrder.indexOf(b.id));

  const moveToSelected = (item) => {
    setSelectedList((prev) => {
      const next = [...prev, item];
      return sortByBaseOrder(next);
    });
    setAvailableList((prev) => prev.filter((i) => i.id !== item.id));
  };

  const moveToAvailable = (item) => {
    setAvailableList((prev) => {
      const next = [...prev, item];
      return sortByBaseOrder(next);
    });
    setSelectedList((prev) => prev.filter((i) => i.id !== item.id));
  };

  /* ===== Drag & Drop handlers ===== */
  const handleDropToSelected = (draggedItem) => {
    if (draggedItem.from === "available") moveToSelected(draggedItem);
  };
  const handleDropToAvailable = (draggedItem) => {
    if (draggedItem.from === "selected") moveToAvailable(draggedItem);
  };

  /* ===== Submit ===== */
  const handleSubmit = async () => {
    if (!farm?.id) return alert("farmId가 없습니다.");

    const payload = selectedList.map((item) => {
      const setting = videoSettings[item.id];
      return {
        farmId: farm.id,
        stepId: item.id === 1 ? null : item.id,
        timelapseName: setting.timelapseName,
        fps: setting.fps,
        duration: setting.duration,
        captureInterval: setting.captureInterval ?? 0,
        resolution: setting.resolution,
        state: setting.state,
      };
    });

    try {
      await timelapseCreate(payload);
      alert("타임랩스 생성 완료");
      onClose();
    } catch (e) {
      console.error("타임랩스 생성 실패", e);
    }
  };

  /* ===== Render ===== */
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,0.45)",
    zIndex: 9999,
  };

  const modal = (
    <div style={overlayStyle} onClick={onClose}>
      <DndProvider backend={HTML5Backend}>
        <div className={styles.tm_modal_box} onClick={(e) => e.stopPropagation()}>
          <h2 className={styles.tm_title}>타임랩스 설정</h2>
          <div className={styles.tm_layout}>
            {/* Available */}
            <DropZone acceptDrop={handleDropToAvailable}>
              <div className={styles.tm_available_section}>
                <div className={styles.tm_section_title}>
                  <h3>생성 가능</h3>
                </div>
                <ScrollWrapper>
                  <div className={styles.tm_icon_list}>
                    {availableList.map((item) => (
                      <DraggableIcon
                        key={item.id}
                        item={item}
                        from="available"
                        onClickMove={() => moveToSelected(item)}
                      />
                    ))}
                  </div>
                </ScrollWrapper>
              </div>
            </DropZone>

            {/* Buttons */}
            <div className={styles.tm_action_buttons}>
              <button
                type="button"
                onClick={() => {
                  setAvailableList(sortByBaseOrder([...availableList, ...selectedList]));
                  setSelectedList([]);
                }}
              >
                &lt;
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedList(sortByBaseOrder([...selectedList, ...availableList]));
                  setAvailableList([]);
                }}
              >
                &gt;
              </button>
            </div>

            {/* Selected */}
            <DropZone acceptDrop={handleDropToSelected}>
              <div className={styles.tm_selected_section}>
                <div className={styles.tm_section_title}>
                  <h3>생성 예정</h3>
                </div>
                <ScrollWrapper>
                  <div className={styles.tm_icon_list}>
                    {selectedList.length === 0 && <p>추가된 설정 없음</p>}
                    {selectedList.map((item) => (
                      <DraggableIcon
                        key={item.id}
                        item={item}
                        from="selected"
                        onClickMove={() => moveToAvailable(item)}
                      />
                    ))}
                  </div>
                </ScrollWrapper>
              </div>
            </DropZone>

            {/* Settings */}
            <div className={styles.tm_settings_section}>
              <div className={styles.tm_section_title}>
                <h3>타임랩스 설정</h3>
              </div>
              <div className={styles.tm_setting_row}>
                <label>FPS</label>
                <select
                  onChange={(e) =>
                    selectedList.forEach((item) =>
                      handleSettingChange(item.id, "fps", Number(e.target.value))
                    )
                  }
                >
                  <option value={24}>24fps</option>
                  <option value={30}>30fps</option>
                  <option value={60}>60fps</option>
                </select>

                <label>해상도</label>
                <select
                  onChange={(e) =>
                    selectedList.forEach((item) =>
                      handleSettingChange(item.id, "resolution", e.target.value)
                    )
                  }
                >
                  <option>1920x1080</option>
                  <option>1280x720</option>
                  <option>3840x2160</option>
                </select>
              </div>

              <h4 className={styles.tm_video_title}>영상 설정</h4>
              <ScrollWrapper>
                <div className={styles.tm_settings_scroll}>
                  {selectedList.map((item) => {
                    const duration = videoSettings[item.id]?.duration ?? 10;
                    return (
                      <div className={styles.tm_video_row} key={item.id}>
                        <span className={styles.tm_video_label}>{item.label}</span>
                        <input
                          type="text"
                          className={styles.tm_video_name}
                          placeholder="영상 이름"
                          value={videoSettings[item.id]?.timelapseName || ""}
                          onChange={(e) =>
                            handleSettingChange(item.id, "timelapseName", e.target.value)
                          }
                        />
                        <div className={styles.tm_duration_box}>
                          {item.id === 1 ? (
                            <input
                              type="number"
                              value={duration}
                              disabled
                              className={styles.tm_video_duration}
                            />
                          ) : (
                            <>
                              <button
                                type="button"
                                className={styles.tm_duration_btn}
                                onClick={() =>
                                  handleSettingChange(item.id, "duration", duration - 1)
                                }
                              >
                                −
                              </button>

                              <input
                                type="number"
                                min={stepMap[item.id]?.periodDays}
                                value={duration}
                                className={styles.tm_video_duration}
                                onChange={(e) =>
                                  handleSettingChange(item.id, "duration", Number(e.target.value))
                                }
                              />

                              <button
                                type="button"
                                className={styles.tm_duration_btn}
                                onClick={() =>
                                  handleSettingChange(item.id, "duration", duration + 1)
                                }
                              >
                                +
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollWrapper>
            </div>
          </div>

          <div className={styles.tm_buttons}>
            <button className={styles.tm_btn_cancel} onClick={onClose}>
              취소
            </button>
            <button className={styles.tm_btn_save} onClick={handleSubmit}>
              저장
            </button>
          </div>
        </div>
      </DndProvider>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modal, document.body) : modal;
};
