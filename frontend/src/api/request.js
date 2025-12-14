// 백앤드 통신을 하기 위해서 필요한 백앤드 쪽 path - 공통 path를 분리하고 남은 나머지 path들
const requests = {
  myPageView: "/mypage/view",
  myPageEdit: "/mypage/edit",
  novaList: "/nova/list",
  farmCardList: "/farm/list",
  myPageTimelapse: "/maypage/timelapse",
  timelapseCreate: "/timelapse/create",
  timelapseInfo: "/timelapse/info",
};

export default requests;
