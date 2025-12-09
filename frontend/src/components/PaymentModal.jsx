import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

/**
 * @typedef {'kakaopay' | 'tosspay'} PaymentMethod
 */

/**
 * @typedef PaymentModalProps
 * @property {boolean} isOpen
 * @property {() => void} onClose
 * @property {number} amount
 * @property {PaymentMethod} paymentMethod
 * @property {() => void} onSuccess
 */

/**
 * @param {PaymentModalProps} props
 */
export function PaymentModal({
  isOpen,
  onClose,
  amount,
  paymentMethod,
  onSuccess,
}) {
  const [processing, setProcessing] =
    useState(false);

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );

    // Mock success
    setProcessing(false);
    onSuccess();
  };

  const paymentName =
    paymentMethod === "kakaopay"
      ? "카카오페이"
      : "토스페이";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1d293d] border-[#314158] text-white max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-[24px]">
            {paymentName} 결제
          </DialogTitle>
        </DialogHeader>

        <div className="py-[32px]">
          {!processing ? (
            <>
              <div className="text-center mb-[32px]">
                {paymentMethod === "kakaopay" ? (
                  <div className="size-[80px] mx-auto mb-[16px] rounded-full bg-[#FEE500] flex items-center justify-center">
                    <span className="text-[32px]">
                      💬
                    </span>
                  </div>
                ) : (
                  <div className="size-[80px] mx-auto mb-[16px] rounded-full bg-[#0064FF] flex items-center justify-center">
                    <span className="text-white text-[28px] font-bold">
                      toss
                    </span>
                  </div>
                )}
                <p className="text-[#90a1b9] text-[14px] mb-[8px]">
                  결제 금액
                </p>
                <p className="text-white text-[32px]">
                  {amount.toLocaleString()}원
                </p>
              </div>

              <div className="space-y-[12px] mb-[24px] p-[16px] bg-[rgba(15,23,43,0.5)] border border-[#314158] rounded-[8px]">
                <p className="text-[#62748e] text-[12px]">
                  💡 테스트 결제 안내
                </p>
                <p className="text-[#90a1b9] text-[13px]">
                  실제 결제는 진행되지 않습니다.
                  {paymentMethod === "kakaopay"
                    ? " 카카오페이 앱에서 결제를 진행해주세요."
                    : " 토스페이 앱에서 결제를 진행해주세요."}
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white hover:opacity-90 h-[48px] text-[16px]"
                onClick={handlePayment}
              >
                {amount.toLocaleString()}원
                결제하기
              </Button>
            </>
          ) : (
            <div className="text-center py-[40px]">
              <Loader2 className="size-[48px] text-[#51a2ff] mx-auto mb-[16px] animate-spin" />
              <p className="text-white text-[18px] mb-[8px]">
                결제 진행 중...
              </p>
              <p className="text-[#90a1b9] text-[14px]">
                {paymentName} 앱에서 결제를
                완료해주세요
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
