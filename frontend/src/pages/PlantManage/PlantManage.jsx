import { useState } from "react";
import "./PlantManage.css";
import PlantModal from "./PlantModal";
import PlantAddModal from "./PlantAddModal";
import farmFullData from "./farmFullData";

function PlantManage() {
  const [selectedFarm, setSelectedFarm] = useState(null); // 상세 모달
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 추가 모달

  const farms = [
    { id: 1, plant: "토마토", status: "좋음", img: "/tomato.jpg" },
    { id: 2, plant: "바질", status: "보통", img: "/basil.jpg" },
    { id: 3, plant: null },
    { id: 4, plant: null },
  ];

  return (
    <div className="plants-page">
      <h1>내 식물 관리</h1>

      <div className="farm-grid">
        {farms.map((farm) => (
          <div
            key={farm.id}
            className="farm-card"
            onClick={() => {
              if (farm.plant) {
                setSelectedFarm(farmFullData); // 🔥 farmFullData 전달
              } else {
                setIsAddModalOpen(true);
              }
            }}
          >
            {farm.plant ? (
              <>
                <img src={farm.img} alt={farm.plant} className="plant-img" />
                <h3>팜 #{farm.id}</h3>
                <p>식물: {farm.plant}</p>
                <p>상태: {farm.status}</p>
              </>
            ) : (
              <div className="empty-farm">
                <span className="plus">+</span>
                <p>식물 심기</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 🔥 모달에 data 전달 */}
      {selectedFarm && <PlantModal data={selectedFarm} onClose={() => setSelectedFarm(null)} />}

      {isAddModalOpen && <PlantAddModal onClose={() => setIsAddModalOpen(false)} />}
    </div>
  );
}

export default PlantManage;
