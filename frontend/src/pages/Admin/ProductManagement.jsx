import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../api/auth/AuthContext";
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
  updateAdminProduct,
} from "../../api/admin/productManagementApi";

import { Button } from "../../components/market/ui/button";
import { Input } from "../../components/market/ui/input";
import { Label } from "../../components/market/ui/label";
import { Badge } from "../../components/market/ui/badge";

import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import "./ProductManagement.css";

export default function ProductManagement() {
  const navigate = useNavigate();
  const { logout, isAdmin } = useAuth();

  /* =========================
     STATE
     ========================= */
  const [products, setProducts] = useState([]);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ProductCreateRequestDTO
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "CROP", // enum 값
    farmName: "",
    systemType: "",
    plant: "",
    stage: "",
    days: 0,
    price: 0,
    unit: "",
    imageUrl: "",
    stock: 100,
    description: "",
    specs: [],
  });

  /* =========================
     INIT - 상품 목록 조회
     ========================= */
  useEffect(() => {
    fetchAdminProducts()
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("상품 목록 조회 실패"));
  }, []);

  /* =========================
     상품 추가 (CREATE)
     ========================= */
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.farmName || !newProduct.price) {
      toast.error("필수 항목을 입력해주세요");
      return;
    }

    try {
      const payload = {
        name: newProduct.name,
        category: newProduct.category,
        farmName: newProduct.farmName,
        systemType: newProduct.systemType || "",
        plant: newProduct.plant || "",
        stage: newProduct.stage || "",
        days: newProduct.days || 0,
        price: newProduct.price.toString(),
        unit: newProduct.unit || "",
        imageUrl: newProduct.imageUrl || "",
        stock: newProduct.stock || 100,
        description: newProduct.description || "",
        specs: newProduct.specs || [],
      };

      const res = await createAdminProduct(payload);
      setProducts((prev) => [...prev, res.data]);
      toast.success("상품이 추가되었습니다");
      setIsAddModal(false);

      // 초기화
      setNewProduct({
        name: "",
        category: "CROP",
        farmName: "",
        systemType: "",
        plant: "",
        stage: "",
        days: 0,
        price: 0,
        unit: "",
        imageUrl: "",
        stock: 100,
        description: "",
        specs: [],
      });
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error("상품 등록 실패");
    }
  };

  /* =========================
     상품 수정 (UPDATE)
     ========================= */
  const handleEditProduct = async () => {
    if (!editingProduct) return;

    const payload = {
      name: editingProduct.name,
      price: editingProduct.price.toString(),
      stock: editingProduct.stock,
      description: editingProduct.description || "",
      specs: editingProduct.specs || [],
    };

    try {
      const res = await updateAdminProduct(
        editingProduct.productId,
        payload
      );
      setProducts((prev) =>
        prev.map((p) =>
          p.productId === res.data.productId ? res.data : p
        )
      );
      toast.success("상품이 수정되었습니다");
      setIsEditModal(false);
      setEditingProduct(null);
    } catch (err) {
      console.log(err.response?.data || err);
      toast.error("상품 수정 실패");
    }
  };

  /* =========================
     상품 삭제 (DELETE)
     ========================= */
  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`${name}을(를) 삭제하시겠습니까?`)) return;

    try {
      await deleteAdminProduct(productId);
      setProducts((prev) =>
        prev.filter((p) => p.productId !== productId)
      );
      toast.success("상품이 삭제되었습니다");
    } catch {
      toast.error("상품 삭제 실패");
    }
  };

  /* =========================
     RENDER
     ========================= */
  return (
    <div className="pm-container">
      {/* 상품 관리 헤더 */}
      <header className="pm-header">
        <div className="pm-header-inner">
          <div className="pm-header-left">
            <button
              className="pm-btn"
              variant="outline"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="mr-2" />
              대시보드
            </button>
            <h1 className="pm-title">상품 관리</h1>
          </div>

          <div className="pm-header-right">
            <button
              className="pm-btn"
              variant="outline"
              onClick={() => setIsAddModal(true)}
            >
              <Plus className="mr-2" />
              상품 추가
            </button>
          </div>
        </div>
      </header>

      {/* Product List */}
      <div className="pm-wrapper">
        <div className="pm-grid">
          {products.map((product) => (
            <div key={product.productId} className="pm-card">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="pm-card-img"
              />

              <Badge className="pm-badge">
                {product.category}
              </Badge>

              <h3>{product.name}</h3>
              <p>{product.farmName}</p>
              <p>{product.price.toLocaleString()}원</p>

              <div className="pm-btn-row">
                <Button
                  className="pm-btn"
                  variant="outline"
                  onClick={() => {
                    setEditingProduct(product);
                    setIsEditModal(true);
                  }}
                >
                  <Edit className="mr-1" />
                  수정
                </Button>

                <Button
                  className="pm-btn"
                  variant="outline"
                  onClick={() =>
                    handleDeleteProduct(
                      product.productId,
                      product.name
                    )
                  }
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ADD MODAL ================= */}
      <Modal
        open={isAddModal}
        onClose={() => setIsAddModal(false)}
        onConfirm={handleAddProduct} 
        title="새 상품 추가"
      >
        <div className="pm-dialog-grid">
          <Label>상품명</Label>
          <Input
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />

          <Label>생산지</Label>
          <Input
            value={newProduct.farmName}
            onChange={(e) =>
              setNewProduct({ ...newProduct, farmName: e.target.value })
            }
          />

          <Label>가격</Label>
          <Input
            type="number"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: Number(e.target.value),
              })
            }
          />
        </div>
      </Modal>

      {/* ================= EDIT MODAL ================= */}
      <Modal
        open={isEditModal}
        onClose={() => setIsEditModal(false)}
        title="상품 수정"
      >
        {editingProduct && (
          <div className="pm-dialog-grid">
            <Label>가격</Label>
            <Input
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: Number(e.target.value),
                })
              }
            />

            <Label>재고</Label>
            <Input
              type="number"
              value={editingProduct.stock}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  stock: Number(e.target.value),
                })
              }
            />

            <Button
              className="pm-btn"
              variant="outline"
              onClick={handleEditProduct}
            >
              수정 완료
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* =========================
    Modal 컴포넌트
   ========================= */
function Modal({ open, onClose, onConfirm, title, children }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-body">{children}</div>

        {/* 버튼 영역 */}
        <div className="modal-wrapper-btns">
          <Button
            className="modal-btn confirm"
            onClick={onConfirm} 
          >
            확인
          </Button>
          <Button
            className="modal-btn cancel"
            onClick={onClose}
          >
            취소
          </Button>

        </div>
      </div>
    </div>
  );
}

