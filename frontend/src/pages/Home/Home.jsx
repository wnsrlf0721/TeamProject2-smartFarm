// src/pages/Home/Home.jsx
import "./Home.css";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Home() {
  const featureRef = useRef(null);
  const deviceRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 900, once: true });

    // HERO
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 40,
        duration: 1.3,
        ease: "power3.out",
      });
    }

    // FEATURE CARD
    if (featureRef.current) {
      gsap.fromTo(
        featureRef.current.querySelectorAll(".feature-card"),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featureRef.current,
            start: "top 80%",
            onEnter: () => {
              gsap.set(".feature-card", { clearProps: "transform" });
            },
            onLeaveBack: () => {
              gsap.set(".feature-card", { clearProps: "transform" });
            },
          },
        }
      );
    }

    // DEVICE BOX
    if (deviceRef.current) {
      gsap.from(deviceRef.current, {
        scrollTrigger: {
          trigger: deviceRef.current,
          start: "top 85%",
        },
        opacity: 0,
        scale: 0.92,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
      });
    }
  }, []);

  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-text">
          <h1 className="hero-title">내 안의 스마트팜, NOVA</h1>
          <p className="hero-sub">라이프스타일 속 자연을 키우는 새로운 방법</p>
          <Link to="/plants" className="hero-btn">
            시작하기
          </Link>
        </div>
      </section>

      {/* 2. INTRO */}
      <section className="intro-section" data-aos="fade-up">
        <h2>NOVA는 당신의 공간을 작은 온실로 바꿉니다</h2>
        <p className="intro-desc">
          초보자도 쉽게 시작할 수 있는 스마트 재배 환경. 물 주기, 조도 관리, 온도 체크 — NOVA가
          함께합니다.
        </p>
      </section>

      {/* 3. FEATURE SECTION */}
      <section className="feature-section" ref={featureRef}>
        <div className="feature-card">
          <img src="/mockups/env.svg" className="feature-icon" />
          <h3>실시간 환경 모니터링</h3>
          <p>온도 · 습도 · 조도 · 토양 수분 자동 감지</p>
        </div>

        <div className="feature-card">
          <img src="/mockups/preset.svg" className="feature-icon" />
          <h3>맞춤 프리셋 관리</h3>
          <p>식물별 최적 조건 제공</p>
        </div>

        <div className="feature-card">
          <img src="/mockups/grow.svg" className="feature-icon" />
          <h3>성장 기록 저장</h3>
          <p>사진 기록 · 물주기 로그 · 성장 히스토리</p>
        </div>

        <div className="feature-card">
          <img src="/mockups/d-day.svg" className="feature-icon" />
          <h3>D-DAY 알림</h3>
          <p>수확 타임라인 자동 계산</p>
        </div>
      </section>

      {/* 4. HISTORY */}
      <section className="history-section">
        <h2>식물과 함께 성장하는 당신의 하루</h2>
        <p>“오늘의 물주기 완료! 지금까지 총 12번 물을 주셨어요.”</p>
        <p>“함께한 지 30일 — 바질이 무럭무럭 자라고 있어요.”</p>
      </section>

      {/* 5. DEVICE SECTION */}
      <section className="device-section">
        <div className="device-box" ref={deviceRef}>
          <h2>NOVA가 만드는 작은 생태계</h2>
          <p>실내에서도 자연과 같은 환경을 제공합니다.</p>
        </div>
      </section>

      {/* 6. MARKET */}
      <section className="market-section">
        <h2>함께하는 스마트 재배 경험</h2>
        <p>팜 마켓에서 재배 노하우를 공유해보세요.</p>
        <Link to="/market" className="market-btn">
          팜 마켓 둘러보기
        </Link>
      </section>

      {/* 7. CTA */}
      <section className="cta-section">
        <h2>NOVA와 함께 시작해보세요</h2>
        <Link to="/plants" className="cta-btn">
          내 식물 관리하러 가기
        </Link>
      </section>
    </div>
  );
}

export default Home;
