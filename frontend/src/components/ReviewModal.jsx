import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";

/**
 * @typedef ReviewModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {string} productName
 * @property {(rating: number, comment: string) => void} onSubmit
 */

/**
 * @param {ReviewModalProps} props
 */
export function ReviewModal({
  isOpen,
  onClose,
  productName,
  onSubmit,
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] =
    useState(0);

  const handleSubmit = () => {
    if (comment.trim().length < 10) {
      alert("리뷰는 최소 10자 이상 작성해주세요");
      return;
    }
    onSubmit(rating, comment);
    setRating(5);
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1d293d] border-[#314158] text-white max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-white text-[20px]">
            리뷰 작성
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-[24px] mt-[24px]">
          <div>
            <p className="text-[#90a1b9] text-[14px] mb-[8px]">
              상품명
            </p>
            <p className="text-white text-[16px]">
              {productName}
            </p>
          </div>

          <div>
            <p className="text-[#90a1b9] text-[14px] mb-[12px]">
              별점
            </p>
            <div className="flex gap-[8px] justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="transition-transform hover:scale-110"
                  onMouseEnter={() =>
                    setHoveredRating(star)
                  }
                  onMouseLeave={() =>
                    setHoveredRating(0)
                  }
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`size-[40px] ${
                      star <=
                      (hoveredRating || rating)
                        ? "fill-[#ffa500] text-[#ffa500]"
                        : "text-[#314158]"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-white text-[16px] mt-[8px]">
              {rating}점
            </p>
          </div>

          <div>
            <p className="text-[#90a1b9] text-[14px] mb-[8px]">
              리뷰 내용 (최소 10자)
            </p>
            <Textarea
              className="bg-[rgba(15,23,43,0.5)] border-[#314158] text-white min-h-[120px]"
              placeholder="상품에 대한 솔직한 리뷰를 작성해주세요"
              value={comment}
              onChange={(e) =>
                setComment(e.target.value)
              }
            />
            <p className="text-[#62748e] text-[12px] mt-[4px]">
              {comment.length}자
            </p>
          </div>

          <div className="flex gap-[12px]">
            <Button
              variant="outline"
              className="flex-1 border-[#314158] text-white hover:text-white hover:bg-white/10"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
              onClick={handleSubmit}
            >
              리뷰 등록
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
