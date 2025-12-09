import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { toast } from "sonner";
import {
  Leaf,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const [userForm, setUserForm] = useState({
    email: "user@example.com",
    password: "user123",
  });

  const [adminForm, setAdminForm] = useState({
    email: "admin@smartfarm.com",
    password: "admin123",
  });

  const [registerForm, setRegisterForm] =
    useState({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      address: "",
      detailAddress: "",
    });

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(
      userForm.email,
      userForm.password
    );
    setLoading(false);

    if (success) {
      toast.success("로그인 성공!");
      navigate("/");
    } else {
      toast.error(
        "이메일 또는 비밀번호가 올바르지 않습니다"
      );
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(
      adminForm.email,
      adminForm.password
    );
    setLoading(false);

    if (success) {
      toast.success("관리자 로그인 성공!");
      navigate("/admin");
    } else {
      toast.error(
        "이메일 또는 비밀번호가 올바르지 않습니다"
      );
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      registerForm.password !==
      registerForm.confirmPassword
    ) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }

    if (
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.name ||
      !registerForm.phone ||
      !registerForm.address
    ) {
      toast.error(
        "모든 필수 항목을 입력해주세요"
      );
      return;
    }

    setLoading(true);
    const success = await register(
      registerForm.email,
      registerForm.password,
      registerForm.name,
      registerForm.phone,
      registerForm.address,
      registerForm.detailAddress
    );
    setLoading(false);

    if (success) {
      toast.success(
        "회원가입 성공! 자동으로 로그인됩니다"
      );
      navigate("/");
    } else {
      toast.error("이미 존재하는 이메일입니다");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1f0a] flex items-center justify-center p-[24px]">
      <div className="w-full max-w-[600px]">
        <div className="text-center mb-[48px]">
          <div className="inline-flex items-center justify-center size-[80px] rounded-full bg-gradient-to-r from-[#16a34a] to-[#15803d] mb-[16px] shadow-lg shadow-[#16a34a]/50">
            <Leaf className="size-[40px] text-white" />
          </div>
          <h1 className="text-[#4ade80] text-[32px] mb-[8px]">
            스마트팜 마켓
          </h1>
          <p className="text-[#16a34a] text-[16px]">
            신선한 작물과 스마트팜 솔루션
          </p>
        </div>

        <Tabs
          defaultValue="user"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 bg-[#0f2e0f] border border-[#1a4d1a] mb-[24px]">
            <TabsTrigger
              value="user"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#16a34a] data-[state=active]:to-[#15803d] data-[state=active]:text-white text-[#4ade80]"
            >
              <User className="size-[16px] mr-2" />
              로그인
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#16a34a] data-[state=active]:to-[#15803d] data-[state=active]:text-white text-[#4ade80]"
            >
              <UserPlus className="size-[16px] mr-2" />
              회원가입
            </TabsTrigger>
            <TabsTrigger
              value="admin"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#fbbf24] data-[state=active]:to-[#f59e0b] data-[state=active]:text-[#0a1f0a] text-[#4ade80]"
            >
              <ShieldCheck className="size-[16px] mr-2" />
              관리자
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <div className="bg-[#0f2e0f] rounded-[16px] border border-[#1a4d1a] p-[32px]">
              <h2 className="text-[#4ade80] text-[24px] mb-[24px]">
                로그인
              </h2>
              <form
                onSubmit={handleUserLogin}
                className="space-y-[20px]"
              >
                <div>
                  <Label
                    htmlFor="user-email"
                    className="text-[#16a34a]"
                  >
                    이메일
                  </Label>
                  <Input
                    id="user-email"
                    type="email"
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={userForm.email}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label
                    htmlFor="user-password"
                    className="text-[#16a34a]"
                  >
                    비밀번호
                  </Label>
                  <Input
                    id="user-password"
                    type="password"
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({
                        ...userForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white hover:from-[#15803d] hover:to-[#166534] h-[48px] text-[16px]"
                  disabled={loading}
                >
                  {loading
                    ? "로그인 중..."
                    : "로그인"}
                </Button>
              </form>

              <div className="mt-[24px] p-[16px] bg-[rgba(15,46,15,0.5)] border border-[#1a4d1a] rounded-[8px]">
                <p className="text-[#16a34a] text-[12px] mb-[8px]">
                  테스트 계정:
                </p>
                <p className="text-[#4ade80] text-[13px]">
                  이메일: user@example.com
                </p>
                <p className="text-[#4ade80] text-[13px]">
                  비밀번호: user123
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="register">
            <div className="bg-[#0f2e0f] rounded-[16px] border border-[#1a4d1a] p-[32px] max-h-[70vh] overflow-y-auto">
              <h2 className="text-[#4ade80] text-[24px] mb-[24px]">
                회원가입
              </h2>
              <form
                onSubmit={handleRegister}
                className="space-y-[20px]"
              >
                <div>
                  <Label className="text-[#16a34a]">
                    이름 *
                  </Label>
                  <Input
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={registerForm.name}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#16a34a]">
                    이메일 *
                  </Label>
                  <Input
                    type="email"
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={registerForm.email}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#16a34a]">
                    비밀번호 *
                  </Label>
                  <Input
                    type="password"
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#16a34a]">
                    비밀번호 확인 *
                  </Label>
                  <Input
                    type="password"
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={
                      registerForm.confirmPassword
                    }
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        confirmPassword:
                          e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#16a34a]">
                    연락처 *
                  </Label>
                  <Input
                    type="tel"
                    placeholder="010-0000-0000"
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={registerForm.phone}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        phone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#16a34a]">
                    주소 *
                  </Label>
                  <Input
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={registerForm.address}
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        address: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#16a34a]">
                    상세 주소
                  </Label>
                  <Input
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={
                      registerForm.detailAddress
                    }
                    onChange={(e) =>
                      setRegisterForm({
                        ...registerForm,
                        detailAddress:
                          e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white hover:from-[#15803d] hover:to-[#166534] h-[48px] text-[16px]"
                  disabled={loading}
                >
                  {loading
                    ? "가입 중..."
                    : "회원가입"}
                </Button>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="admin">
            <div className="bg-[#0f2e0f] rounded-[16px] border border-[#1a4d1a] p-[32px]">
              <h2 className="text-[#4ade80] text-[24px] mb-[24px]">
                관리자 로그인
              </h2>
              <form
                onSubmit={handleAdminLogin}
                className="space-y-[20px]"
              >
                <div>
                  <Label className="text-[#90a1b9]">
                    이메일
                  </Label>
                  <Input
                    type="email"
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={adminForm.email}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label className="text-[#90a1b9]">
                    비밀번호
                  </Label>
                  <Input
                    type="password"
                    className="bg-[rgba(15,46,15,0.5)] border-[#1a4d1a] text-white mt-2"
                    value={adminForm.password}
                    onChange={(e) =>
                      setAdminForm({
                        ...adminForm,
                        password: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#155dfc] to-[#9810fa] text-white hover:opacity-90 h-[48px] text-[16px]"
                  disabled={loading}
                >
                  {loading
                    ? "로그인 중..."
                    : "관리자 로그인"}
                </Button>
              </form>

              <div className="mt-[24px] p-[16px] bg-[rgba(15,46,15,0.5)] border border-[#1a4d1a] rounded-[8px]">
                <p className="text-[#16a34a] text-[12px] mb-[8px]">
                  테스트 계정:
                </p>
                <p className="text-[#4ade80] text-[13px]">
                  이메일: admin@smartfarm.com
                </p>
                <p className="text-[#4ade80] text-[13px]">
                  비밀번호: admin123
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
