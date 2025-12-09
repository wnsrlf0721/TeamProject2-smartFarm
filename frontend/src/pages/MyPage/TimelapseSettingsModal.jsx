import React, {useState, useMemo, useEffect} from "react";
import {Video, Film} from "lucide-react";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import "./SettingModal.css";

const ItemTypes = {ICON: "icon"};

/* ============================
    Draggable Icon
============================= */
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

/* ============================
    Drop Zone
============================= */
function DropZone({children, acceptDrop}) {
  const [, drop] = useDrop({
    accept: ItemTypes.ICON,
    drop: (item) => acceptDrop(item),
  });

  return <div ref={drop}>{children}</div>;
}

/* ============================
    Main Modal Component
============================= */
export default function TimelapseSettingsModal({isOpen, onClose}) {
  if (!isOpen) return null;

  /** 원래 순서를 유지할 기준 */
  const baseOrder = useMemo(() => [1, 2, 3, 4], []);

  const [availableList, setAvailableList] = useState([
    {id: 1, label: "전체 영상", type: "video"},
    {id: 2, label: "단계1", type: "film"},
    {id: 3, label: "단계2", type: "film"},
    {id: 4, label: "단계3", type: "film"},
  ]);

  const [selectedList, setSelectedList] = useState([]);

  /*==============================
    DB 구조에 맞춘 단일 JSON 객체
  ================================*/
  const [videoSettings, setVideoSettings] = useState({});

  /* ============================
      selectedList 변경 시 JSON 자동 생성
  ============================== */
  useEffect(() => {
    const newSettings = {};

    selectedList.forEach((item) => {
      newSettings[item.id] = {
        setting_id: null, // DB auto increment
        farm_id: null, // 나중에 서버에서 자동 주입 가능
        preset_step_id: item.id,
        fps: 30,
        duration: 10,
        interval: null,
        resolution: "1920x1080",
        state: "PENDING",
        name: "", // 영상 이름
      };
    });

    setVideoSettings(newSettings);
  }, [selectedList]);

  const sortByOriginalOrder = (list) => {
    return [...list].sort((a, b) => baseOrder.indexOf(a.id) - baseOrder.indexOf(b.id));
  };

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

  const addAll = () => {
    setSelectedList(sortByOriginalOrder([...selectedList, ...availableList]));
    setAvailableList([]);
  };

  const removeAll = () => {
    setAvailableList(sortByOriginalOrder([...availableList, ...selectedList]));
    setSelectedList([]);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <DndProvider backend={HTML5Backend}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">타임랩스 설정</h2>

          <div className="timelapse-layout">
            {/* Left */}
            <DropZone acceptDrop={handleDropToAvailable}>
              <div className="available-section">
                <h3>생성 가능</h3>
                <div className="icon-list">
                  {availableList.map((item) => (
                    <DraggableIcon
                      key={item.id}
                      item={item}
                      from="available"
                      onClickMove={(i) => moveToSelected(i)}
                    />
                  ))}
                </div>
              </div>
            </DropZone>

            {/* Center Buttons */}
            <div className="action-buttons">
              <button onClick={removeAll}>&lt;</button>
              <button onClick={addAll}>&gt;</button>
            </div>

            {/* Right */}
            <DropZone acceptDrop={handleDropToSelected}>
              <div className="selected-section">
                <h3>생성 예정</h3>
                <div className="icon-list">
                  {selectedList.length === 0 && <p>추가된 타임랩스 없음</p>}
                  {selectedList.map((item) => (
                    <DraggableIcon
                      key={item.id}
                      item={item}
                      from="selected"
                      onClickMove={(i) => moveToAvailable(i)}
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
                    placeholder="영상 이름"
                    value={videoSettings[item.id]?.name || ""}
                    onChange={(e) => handleSettingChange(item.id, "name", e.target.value)}
                  />

                  <input
                    type="number"
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
            <button className="cancel-btn" onClick={onClose}>
              취소
            </button>

            <button
              className="save-btn"
              onClick={() => {
                console.log("🎬 저장되는 JSON:", videoSettings);
                onClose();
              }}
            >
              저장
            </button>
          </div>
        </div>
      </DndProvider>
    </div>
  );
}
