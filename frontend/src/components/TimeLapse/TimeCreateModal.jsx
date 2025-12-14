import React, {useState, useMemo, useEffect, useRef} from "react";
import {Video, Film} from "lucide-react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {createPortal} from "react-dom";
import {timelapseCreate} from "../../api/timelapse/timelapseAPI";
import styles from "./TimeCreateModal.module.css";

const ItemTypes = {ICON: "icon"};

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

function DropZone({children, acceptDrop}) {
  const [, drop] = useDrop({
    accept: ItemTypes.ICON,
    drop: (item) => acceptDrop(item),
  });
  return <div ref={drop}>{children}</div>;
}

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

export const TimeCreateModal = ({farm, onClose, onCreate}) => {
  const baseOrder = useMemo(() => {
    if (!farm || !farm.stages) return [1];
    return [1, ...farm.stages.map((s) => s.id)];
  }, [farm]);

  const [availableList, setAvailableList] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [videoSettings, setVideoSettings] = useState({});

  useEffect(() => {
    if (!farm?.stages) return;

    const dynamicList = [
      {id: 1, label: "전체 영상", type: "video"},
      ...farm.stages.map((step) => ({
        id: step.id,
        label: step.name,
        type: "film",
      })),
    ];
    setAvailableList(dynamicList);
  }, [farm]);

  useEffect(() => {
    const newSettings = {};
    selectedList.forEach((item) => {
      newSettings[item.id] = {
        setting_id: null,
        farm_id: null,
        preset_step_id: item.id,
        fps: 30,
        duration: 10,
        interval: null,
        resolution: "1920x1080",
        state: "PENDING",
        name: "",
      };
    });
    setVideoSettings(newSettings);
  }, [selectedList]);

  const sortByOriginalOrder = (list) =>
    [...list].sort((a, b) => {
      const ai = baseOrder.indexOf(a.id);
      const bi = baseOrder.indexOf(b.id);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });

  const moveToSelected = (item) => {
    setSelectedList(sortByOriginalOrder([...selectedList, item]));
    setAvailableList(availableList.filter((i) => i.id !== item.id));
  };

  const moveToAvailable = (item) => {
    setAvailableList(sortByOriginalOrder([...availableList, item]));
    setSelectedList(selectedList.filter((i) => i.id !== item.id));
  };

  const handleDropToSelected = (item) => {
    if (item.from === "available") moveToSelected(item);
  };

  const handleDropToAvailable = (item) => {
    if (item.from === "selected") moveToAvailable(item);
  };

  const handleSettingChange = (id, field, value) => {
    setVideoSettings({
      ...videoSettings,
      [id]: {
        ...videoSettings[id],
        [field]: value,
      },
    });
  };

  // const handleSubmit = () => {
  //   const finalData = {
  //     ...farm,
  //     timelapseSettings: videoSettings,
  //   };
  //   onCreate(finalData);
  // };

  const handleSubmit = async () => {
    try {
      const timelapseRequestDTOList = selectedList.map((item) => {
        const setting = videoSettings[item.id];

        return {
          farmId: 1,
          stepId: 1,
          timelapseName: setting.name,
          fps: setting.fps,
          duration: setting.duration,
          captureInterval: setting.interval ?? 0,
          resolution: setting.resolution,
          state: setting.state,
        };
      });

      console.log("🔥 서버로 보낼 데이터", timelapseRequestDTOList);

      await timelapseCreate(timelapseRequestDTOList);

      alert("타임랩스 생성 완료");
      onClose();
    } catch (error) {
      console.error("❌ 타임랩스 생성 실패", error);
    }
  };

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,0.45)",
    zIndex: 9999,
  };

  const modalElement = (
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
                  setAvailableList(sortByOriginalOrder([...availableList, ...selectedList]));
                  setSelectedList([]);
                }}
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedList(sortByOriginalOrder([...selectedList, ...availableList]));
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
                          value={videoSettings[item.id]?.name || ""}
                          onChange={(e) => handleSettingChange(item.id, "name", e.target.value)}
                        />
                        <div className={styles.tm_duration_box}>
                          <button
                            type="button"
                            className={styles.tm_duration_btn}
                            onClick={() =>
                              handleSettingChange(item.id, "duration", Math.max(1, duration - 1))
                            }
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={duration}
                            className={styles.tm_video_duration}
                            onChange={(e) =>
                              handleSettingChange(
                                item.id,
                                "duration",
                                Math.max(1, Number(e.target.value))
                              )
                            }
                          />
                          <button
                            type="button"
                            className={styles.tm_duration_btn}
                            onClick={() => handleSettingChange(item.id, "duration", duration + 1)}
                          >
                            +
                          </button>
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

  if (typeof document !== "undefined") {
    return createPortal(modalElement, document.body);
  }
  return modalElement;
};
