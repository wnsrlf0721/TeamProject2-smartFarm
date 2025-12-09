import { useNavigate } from "react-router";
import { useNotifications } from "../../contexts/NotificationContext";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  ArrowLeft,
  Bell,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  RotateCcw,
  Info,
} from "lucide-react";

const notificationIcons = {
  order: Package,
  payment: CreditCard,
  shipping: Truck,
  delivery: CheckCircle,
  refund: RotateCcw,
  system: Info,
};

const notificationColors = {
  order: "text-[#51a2ff]",
  payment: "text-[#05df72]",
  shipping: "text-[#c27aff]",
  delivery: "text-[#fbbf24]",
  refund: "text-[#ff5555]",
  system: "text-[#90a1b9]",
};

export default function Notifications() {
  const navigate = useNavigate();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
  } = useNotifications();

  const handleNotificationClick = (notif) => {
    if (!notif.read) {
      markAsRead(notif.id);
    }
    if (notif.orderId) {
      navigate(`/tracking/${notif.orderId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172b]">
      {/* Header */}
      <header className="bg-[#1d293d] border-b border-[#314158]">
        <div className="max-w-[1200px] mx-auto px-[24px] h-[80px] flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            <Button
              variant="ghost"
              className="text-white hover:text-white hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="size-[20px] mr-2" />
              홈으로
            </Button>
            <h1 className="text-white text-[24px]">
              알림
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] border-0">
                {unreadCount}개 읽지 않음
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              className="border-[#314158] text-white hover:text-white hover:bg-white/10"
              onClick={markAllAsRead}
            >
              모두 읽음 처리
            </Button>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-[24px] py-[48px]">
        {notifications.length === 0 ? (
          <div className="text-center py-[120px]">
            <Bell className="size-[64px] text-[#314158] mx-auto mb-[24px]" />
            <p className="text-[#90a1b9] text-[20px] mb-[8px]">
              알림이 없습니다
            </p>
            <p className="text-[#62748e] text-[14px] mb-[24px]">
              새로운 알림이 도착하면 여기에
              표시됩니다
            </p>
            <Button
              className="bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white"
              onClick={() => navigate("/")}
            >
              쇼핑하러 가기
            </Button>
          </div>
        ) : (
          <div className="space-y-[12px]">
            {notifications.map((notif) => {
              const Icon =
                notificationIcons[notif.type];
              const colorClass =
                notificationColors[notif.type];

              return (
                <div
                  key={notif.id}
                  className={`bg-[#1d293d] rounded-[12px] border border-[#314158] p-[20px] cursor-pointer transition-all hover:border-[#51a2ff] ${
                    !notif.read
                      ? "bg-[rgba(81,162,255,0.05)]"
                      : ""
                  }`}
                  onClick={() =>
                    handleNotificationClick(notif)
                  }
                >
                  <div className="flex gap-[16px]">
                    <div
                      className={`${colorClass} mt-[4px]`}
                    >
                      <Icon className="size-[24px]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-[8px]">
                        <div className="flex items-center gap-[8px]">
                          <h3 className="text-white text-[16px]">
                            {notif.title}
                          </h3>
                          {!notif.read && (
                            <div className="size-[8px] rounded-full bg-gradient-to-r from-[#155dfc] to-[#9810fa]" />
                          )}
                        </div>
                        <p className="text-[#62748e] text-[12px]">
                          {notif.createdAt.toLocaleString(
                            "ko-KR",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <p className="text-[#90a1b9] text-[14px] leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.orderId && (
                        <div className="mt-[12px]">
                          <Badge className="bg-[rgba(15,23,43,0.5)] border border-[#314158] text-[#90a1b9]">
                            주문번호:{" "}
                            {notif.orderId}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
