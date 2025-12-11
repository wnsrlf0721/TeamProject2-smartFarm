import React, {useState, useMemo, useEffect} from "react";
import {Video, Film} from "lucide-react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {createPortal} from "react-dom";
import "./SettingModal.css";

const ItemTypes = {ICON: "icon"};

/* DraggableIcon (unchanged) */
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
      className="icon-card"
      style={{opacity: isDragging ? 0.4 : 1}}
      onClick={() => onClickMove(item, from)}
    >
      {item.type === "video" ? <Video size={28} /> : <Film size={28} />}
      <span className="icon-label">{item.label}</span>
    </div>
  );
}

/* DropZone (unchanged) */
function DropZone({children, acceptDrop}) {
  const [, drop] = useDrop({
    accept: ItemTypes.ICON,
    drop: (item) => acceptDrop(item),
  });

  return <div ref={drop}>{children}</div>;
}

/* TimeCreateModal with Portal (replace your existing component with this) */
export const TimeCreateModal = ({farm, onClose, onCreate}) => {
  useEffect(() => {
    console.log("🔥 넘어온 farm 데이터:", farm);
  }, [farm]);

  const baseOrder = useMemo(() => {
    if (!farm || !farm.stages) return [1];
    return [1, ...farm.stages.map((s) => s.id)];
  }, [farm]);

  const [availableList, setAvailableList] = useState([]);
  useEffect(() => {
    if (!farm || !farm.stages) return;

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
  const [selectedList, setSelectedList] = useState([]);
  const [videoSettings, setVideoSettings] = useState({});

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

  const handleSubmit = () => {
    const finalData = {
      ...farm,
      timelapseSettings: videoSettings,
    };
    console.log("🔥 최종 저장 데이터:", finalData);
    onCreate(finalData);
  };

  // 안전한 inline overlay style (우선순위를 높여 부모 제약 회피)
  const overlayStyle = {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,0.45)",
    zIndex: 9999,
    // ensure pointer events pass through overlay except the modal itself
  };

  // inline modal-box override to ensure correct dimensions if something overrides CSS
  const modalBoxInline = {
    width: "900px",
    height: "700px",
    maxWidth: "calc(100% - 40px)",
    maxHeight: "calc(100vh - 40px)",
    boxSizing: "border-box",
  };

  // Build the modal element (same structure as your original)
  const modalElement = (
    <div style={overlayStyle} onClick={onClose}>
      <DndProvider backend={HTML5Backend}>
        <div className="modal-box" style={modalBoxInline} onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">타임랩스 설정</h2>

          <div className="timelapse-layout">
            <DropZone acceptDrop={handleDropToAvailable}>
              <div className="available-section">
                <h3>생성 가능</h3>
                <div className="icon-list">
                  {availableList.map((item) => (
                    <DraggableIcon
                      key={item.id}
                      item={item}
                      from="available"
                      onClickMove={() => moveToSelected(item)}
                    />
                  ))}
                </div>
              </div>
            </DropZone>

            <div className="action-buttons">
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

            <DropZone acceptDrop={handleDropToSelected}>
              <div className="selected-section">
                <h3>생성 예정</h3>
                <div className="icon-list">
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
              </div>
            </DropZone>

            {/* Setting */}
            <div className="settings-section">
              <h3>타임랩스 설정</h3>

              {/* 공통 설정 (FPS + 해상도) */}
              <div className="setting-row">
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

              {/* 개별 설정 */}
              <h4 className="video-name-title">영상 설정</h4>

              {selectedList.map((item) => (
                <div className="video-setting-row" key={item.id}>
                  <span className="video-setting-label">{item.label}</span>

                  <input
                    type="text"
                    className="video-name-input"
                    placeholder="영상 이름"
                    value={videoSettings[item.id]?.name || ""}
                    onChange={(e) => handleSettingChange(item.id, "name", e.target.value)}
                  />

                  <input
                    type="number"
                    className="video-duration-input"
                    placeholder="초"
                    min="1"
                    value={videoSettings[item.id]?.duration || ""}
                    onChange={(e) =>
                      handleSettingChange(item.id, "duration", Number(e.target.value))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="modal-buttons">
            <button className="btn-cancel" onClick={onClose}>
              취소
            </button>
            <button className="save-btn" onClick={handleSubmit}>
              저장
            </button>
          </div>
        </div>
      </DndProvider>
    </div>
  );

  // createPortal -> body 에 붙여서 부모 제약을 완전히 피함
  if (typeof document !== "undefined" && document.body) {
    return createPortal(modalElement, document.body);
  }
  // fallback (서버 사이드나 document가 없을 때)
  return modalElement;
};
