import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { useProducts } from "../../../contexts/ProductContext";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Badge } from "../../../components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {'crop'|'device'|'service'} category
 * @property {string} name
 * @property {string} farmName
 * @property {string} systemType
 * @property {string} plant
 * @property {string} stage
 * @property {number} days
 * @property {number} price
 * @property {string} unit
 * @property {string} image
 * @property {string} description
 * @property {number} stock
 */

export default function ProductManagement() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  /** @type {[boolean, Function]} */
  const [isAddDialogOpen, setIsAddDialogOpen] =
    useState(false);

  /** @type {[boolean, Function]} */
  const [isEditDialogOpen, setIsEditDialogOpen] =
    useState(false);

  /** @type {[Product|null, Function]} */
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [newProduct, setNewProduct] = useState({
    /** @type {'crop'|'device'|'service'} */
    category: "crop",
    name: "",
    farmName: "",
    systemType: "",
    plant: "",
    stage: "",
    days: 0,
    price: 0,
    unit: "",
    image: "",
    description: "",
    stock: 100,
  });

  const handleAddProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.farmName ||
      !newProduct.price
    ) {
      toast.error("필수 항목을 입력해주세요");
      return;
    }

    addProduct(newProduct);
    toast.success("상품이 추가되었습니다");

    setIsAddDialogOpen(false);

    setNewProduct({
      category: "crop",
      name: "",
      farmName: "",
      systemType: "",
      plant: "",
      stage: "",
      days: 0,
      price: 0,
      unit: "",
      image: "",
      description: "",
      stock: 100,
    });
  };

  const handleEditProduct = () => {
    if (!editingProduct) return;

    updateProduct(
      editingProduct.id,
      editingProduct
    );
    toast.success("상품이 수정되었습니다");

    setIsEditDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id, name) => {
    if (
      window.confirm(
        `${name}을(를) 삭제하시겠습니까?`
      )
    ) {
      deleteProduct(id);
      toast.success("상품이 삭제되었습니다");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172b]">
      {/* Header */}
      <header className="bg-[#1d293d] border-b border-[#314158]">
        <div className="max-w-[1400px] mx-auto px-[24px] h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={() => navigate("/admin")}
            >
              <ArrowLeft className="size-[20px] mr-2" />
              대시보드
            </Button>

            <h1 className="text-white text-[24px]">
              상품 관리
            </h1>
          </div>

          <div className="flex items-center gap-[12px]">
            <Button
              className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
              onClick={() =>
                setIsAddDialogOpen(true)
              }
            >
              <Plus className="size-[20px] mr-2" />
              상품 추가
            </Button>

            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="size-[20px]" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-[24px] py-[48px]">
        <div className="grid grid-cols-3 gap-[24px]">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#1d293d] rounded-[16px] border border-[#314158] overflow-hidden"
            >
              <div className="h-[160px] relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                <Badge
                  className={`absolute top-[12px] right-[12px] ${
                    product.category === "crop"
                      ? "bg-[#05df72]"
                      : product.category ===
                        "device"
                      ? "bg-[#51a2ff]"
                      : "bg-[#c27aff]"
                  } text-white border-0`}
                >
                  {product.category === "crop"
                    ? "작물"
                    : product.category ===
                      "device"
                    ? "기기"
                    : "서비스"}
                </Badge>
              </div>

              <div className="p-[20px]">
                <h3 className="text-white text-[18px] mb-[4px]">
                  {product.category === "device"
                    ? product.name
                    : product.farmName}
                </h3>

                <p className="text-[#90a1b9] text-[14px] mb-[16px]">
                  {product.category === "device"
                    ? product.farmName
                    : product.plant}
                </p>

                <div className="mb-[16px]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-[20px]">
                        {product.price.toLocaleString()}
                        원
                      </p>
                      <p className="text-[#62748e] text-[12px]">
                        {product.unit}
                      </p>
                    </div>

                    {product.stock !==
                      undefined && (
                      <Badge
                        className={`${
                          product.stock <= 3
                            ? "bg-[#ff5555]"
                            : product.stock <= 10
                            ? "bg-[#ffa500]"
                            : "bg-[#05df72]"
                        } text-white border-0`}
                      >
                        재고: {product.stock}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-[8px]">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#314158] text-white hover:text-white hover:bg-white/10"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Edit className="size-[16px] mr-2" />
                    수정
                  </Button>

                  <Button
                    variant="outline"
                    className="border-[#ff5555] text-[#ff5555] hover:text-[#ff5555] hover:bg-[#ff5555]/10"
                    onClick={() =>
                      handleDeleteProduct(
                        product.id,
                        product.name
                      )
                    }
                  >
                    <Trash2 className="size-[16px]" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent className="bg-[#1d293d] border-[#314158] text-white max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              새 상품 추가
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-[16px] mt-[24px]">
            <div>
              <Label className="text-[#90a1b9]">
                카테고리
              </Label>

              <select
                className="w-full mt-2 bg-[rgba(15,23,43,0.5)] border border-[#314158] rounded-[8px] px-[12px] py-[8px] text-white"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    category: e.target.value,
                  })
                }
              >
                <option value="crop">작물</option>
                <option value="device">
                  기기
                </option>
                <option value="service">
                  서비스
                </option>
              </select>
            </div>

            <div>
              <Label className="text-[#90a1b9]">
                상품명
              </Label>
              <Input
                className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="text-[#90a1b9]">
                팜/시리즈명
              </Label>
              <Input
                className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                value={newProduct.farmName}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    farmName: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="text-[#90a1b9]">
                시스템 타입
              </Label>
              <Input
                className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                value={newProduct.systemType}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    systemType: e.target.value,
                  })
                }
              />
            </div>

            {newProduct.category === "crop" && (
              <>
                <div>
                  <Label className="text-[#90a1b9]">
                    식물
                  </Label>
                  <Input
                    className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                    value={newProduct.plant}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        plant: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label className="text-[#90a1b9]">
                    단계
                  </Label>
                  <Input
                    className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                    value={newProduct.stage}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        stage: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label className="text-[#90a1b9]">
                    재배일
                  </Label>
                  <Input
                    type="number"
                    className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                    value={newProduct.days}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        days: parseInt(
                          e.target.value
                        ),
                      })
                    }
                  />
                </div>
              </>
            )}

            <div>
              <Label className="text-[#90a1b9]">
                가격 (원)
              </Label>
              <Input
                type="number"
                className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: parseInt(
                      e.target.value
                    ),
                  })
                }
              />
            </div>

            <div>
              <Label className="text-[#90a1b9]">
                단위
              </Label>
              <Input
                className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                value={newProduct.unit}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    unit: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="text-[#90a1b9]">
                이미지 URL
              </Label>
              <Input
                className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                value={newProduct.image}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    image: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="text-[#90a1b9]">
                설명
              </Label>
              <Input
                className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="text-[#90a1b9]">
                재고 (개)
              </Label>
              <Input
                type="number"
                className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock:
                      parseInt(e.target.value) ||
                      0,
                  })
                }
              />
            </div>

            <Button
              className="w-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
              onClick={handleAddProduct}
            >
              추가
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editingProduct && (
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        >
          <DialogContent className="bg-[#1d293d] border-[#314158] text-white max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                상품 수정
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-[16px] mt-[24px]">
              <div>
                <Label className="text-[#90a1b9]">
                  가격 (원)
                </Label>
                <Input
                  type="number"
                  className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseInt(
                        e.target.value
                      ),
                    })
                  }
                />
              </div>

              <div>
                <Label className="text-[#90a1b9]">
                  단위
                </Label>
                <Input
                  className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                  value={editingProduct.unit}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      unit: e.target.value,
                    })
                  }
                />
              </div>

              {editingProduct.category ===
                "crop" && (
                <>
                  <div>
                    <Label className="text-[#90a1b9]">
                      단계
                    </Label>
                    <Input
                      className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                      value={editingProduct.stage}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stage: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-[#90a1b9]">
                      재배일
                    </Label>
                    <Input
                      type="number"
                      className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                      value={editingProduct.days}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          days: parseInt(
                            e.target.value
                          ),
                        })
                      }
                    />
                  </div>
                </>
              )}

              <div>
                <Label className="text-[#90a1b9]">
                  재고 (개)
                </Label>
                <Input
                  type="number"
                  className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white mt-2"
                  value={
                    editingProduct.stock || 0
                  }
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stock:
                        parseInt(
                          e.target.value
                        ) || 0,
                    })
                  }
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
                onClick={handleEditProduct}
              >
                수정 완료
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
