'use client';
import Link from "next/link";

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -70px) scale(1.1); }
          66% { transform: translate(-30px, 35px) scale(0.92); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-70px, 50px) scale(1.15); }
          66% { transform: translate(40px, -45px) scale(0.88); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(35px, 65px) scale(1.08); }
        }
        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, -35px) scale(1.12); }
        }
        @keyframes rotateSlow {
          from { transform: translate(-50%, -50%) rotate(0deg) rotateX(20deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg) rotateX(20deg); }
        }
        @keyframes rotateReverse {
          from { transform: translate(-50%, -50%) rotate(360deg) rotateY(15deg); }
          to   { transform: translate(-50%, -50%) rotate(0deg) rotateY(15deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 28px rgba(234,119,41,0.35), 0 0 56px rgba(234,119,41,0.15), 0 16px 48px rgba(0,0,0,0.6); }
          50%       { box-shadow: 0 0 48px rgba(234,119,41,0.6),  0 0 96px rgba(234,119,41,0.3),  0 16px 48px rgba(0,0,0,0.6); }
        }
        @keyframes btnScale {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.025); }
        }
        @keyframes particle {
          0%   { transform: translateY(105vh) rotate(0deg);   opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 0.4; }
          100% { transform: translateY(-80px) rotate(540deg); opacity: 0; }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 24px rgba(234,119,41,0.45); }
          50%       { text-shadow: 0 0 48px rgba(234,119,41,0.85), 0 0 80px rgba(234,119,41,0.35); }
        }

        .orb-1 { animation: float1 13s ease-in-out infinite; }
        .orb-2 { animation: float2 16s ease-in-out infinite; }
        .orb-3 { animation: float3 11s ease-in-out infinite; }
        .orb-4 { animation: float4 19s ease-in-out infinite; }

        .ring-a { animation: rotateSlow    22s linear infinite; transform-style: preserve-3d; }
        .ring-b { animation: rotateReverse 15s linear infinite; transform-style: preserve-3d; }
        .ring-c { animation: rotateSlow    30s linear infinite; transform-style: preserve-3d; }

        .card-in  { animation: fadeInUp 0.85s ease-out 0.1s both; }
        .title-in { animation: fadeInUp 0.9s ease-out 0.35s both, titleGlow 3s ease-in-out 1.25s infinite; }
        .sub-in   { animation: fadeInUp 0.9s ease-out 0.55s both; }
        .btn-in   { animation: fadeInUp 0.9s ease-out 0.75s both, glowPulse 2.6s ease-in-out 1.75s infinite, btnScale 3s ease-in-out 1.75s infinite; }

        .shimmer-orange {
          background: linear-gradient(90deg, #c05a10 0%, #ea7729 28%, #fbbf7a 50%, #ea7729 72%, #c05a10 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          animation: particle linear infinite;
          pointer-events: none;
        }
        .main-card {
          padding: 64px 72px;
        }
        .btn-iniciar {
          display: inline-block;
          padding: 18px 88px;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #ffffff;
          background: linear-gradient(135deg, #ea7729 0%, #c05a10 50%, #ea7729 100%);
          background-size: 200% auto;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          text-transform: uppercase;
          transition: background-position 0.4s ease, transform 0.15s ease;
          font-family: var(--font-sans);
          width: auto;
        }
        .btn-iniciar:hover {
          background-position: right center;
          transform: scale(1.055);
        }
        @media (max-width: 480px) {
          .main-card {
            padding: 40px 24px;
          }
          .btn-iniciar {
            width: 100%;
            padding: 16px 24px;
            font-size: 1rem;
            letter-spacing: 0.18em;
          }
        }
        @media (min-width: 481px) and (max-width: 640px) {
          .main-card {
            padding: 48px 36px;
          }
          .btn-iniciar {
            padding: 18px 56px;
          }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(145deg, #0a0a0a 0%, #111111 40%, #0f0a06 70%, #0a0a0a 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective: "1200px",
      }}>

        {/* ── Orbes de fondo ── */}
        <div className="orb-1" style={{
          position: "absolute", top: "5%", left: "8%",
          width: "480px", height: "480px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,119,41,0.22) 0%, rgba(180,80,20,0.1) 45%, transparent 70%)",
          filter: "blur(70px)", pointerEvents: "none",
        }} />
        <div className="orb-2" style={{
          position: "absolute", bottom: "8%", right: "6%",
          width: "560px", height: "560px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,119,41,0.18) 0%, rgba(150,60,10,0.08) 45%, transparent 70%)",
          filter: "blur(90px)", pointerEvents: "none",
        }} />
        <div className="orb-3" style={{
          position: "absolute", top: "38%", right: "15%",
          width: "300px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />
        <div className="orb-4" style={{
          position: "absolute", top: "15%", left: "42%",
          width: "260px", height: "260px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,119,41,0.12) 0%, transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
        }} />

        {/* ── Anillos 3D ── */}
        <div className="ring-a" style={{
          position: "absolute", top: "50%", left: "50%",
          width: "820px", height: "820px", borderRadius: "50%",
          border: "1px solid rgba(234,119,41,0.07)",
          pointerEvents: "none",
        }} />
        <div className="ring-b" style={{
          position: "absolute", top: "50%", left: "50%",
          width: "640px", height: "640px", borderRadius: "50%",
          border: "1px solid rgba(234,119,41,0.1)",
          pointerEvents: "none",
        }} />
        <div className="ring-c" style={{
          position: "absolute", top: "50%", left: "50%",
          width: "480px", height: "480px", borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }} />

        {/* ── Partículas ── */}
        {[...Array(14)].map((_, i) => {
          const isOrange = i % 3 !== 2;
          return (
            <div key={i} className="particle" style={{
              left: `${(i * 7.4) % 100}%`,
              width:  i % 2 === 0 ? "5px" : "3px",
              height: i % 2 === 0 ? "5px" : "3px",
              background: isOrange
                ? `rgba(234,119,41,${0.4 + (i % 4) * 0.1})`
                : "rgba(255,255,255,0.35)",
              animationDuration: `${9 + (i * 2.3) % 11}s`,
              animationDelay:    `${(i * 1.7) % 9}s`,
            }} />
          );
        })}

        {/* ── Grid sutil ── */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(234,119,41,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,119,41,0.025) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }} />

        {/* ── Tarjeta principal ── */}
        <div className="card-in main-card" style={{
          position: "relative", zIndex: 10,
          backdropFilter: "blur(28px) saturate(160%)",
          WebkitBackdropFilter: "blur(28px) saturate(160%)",
          background: "linear-gradient(140deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          border: "1px solid rgba(234,119,41,0.22)",
          borderRadius: "20px",
          maxWidth: "660px",
          width: "92%",
          textAlign: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}>

          {/* Línea decorativa superior */}
          <div style={{
            width: "72px", height: "3px", margin: "0 auto 36px",
            background: "linear-gradient(90deg, transparent, #ea7729, transparent)",
            borderRadius: "2px",
          }} />

          {/* Ícono */}
          <div style={{
            width: "76px", height: "76px",
            margin: "0 auto 30px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(234,119,41,0.18), rgba(234,119,41,0.04))",
            border: "1.5px solid rgba(234,119,41,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "34px",
            boxShadow: "0 0 28px rgba(234,119,41,0.18)",
          }}>
            ⚖️
          </div>

          {/* Título */}
          <p className="sub-in" style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: "10px",
            fontFamily: "var(--font-sans)",
          }}>
            Bienvenido al sistema de
          </p>

          <h1 className="title-in shimmer-orange" style={{
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            fontWeight: "800",
            letterSpacing: "0.06em",
            lineHeight: "1.2",
            marginBottom: "6px",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}>
            NOTARÍA PÚBLICA
          </h1>

          <h2 className="title-in" style={{
            fontSize: "clamp(2rem, 5.5vw, 3.2rem)",
            fontWeight: "900",
            letterSpacing: "0.04em",
            lineHeight: "1.05",
            marginBottom: "10px",
            fontFamily: "Georgia, 'Times New Roman', serif",
            color: "#ea7729",
          }}>
            NÚMERO UNO
          </h2>

          <h3 className="sub-in" style={{
            fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
            fontWeight: "600",
            letterSpacing: "0.14em",
            color: "rgba(255,255,255,0.75)",
            marginBottom: "0",
            fontFamily: "Georgia, 'Times New Roman', serif",
          }}>
            ALTOTONGA, VER.
          </h3>

          {/* Separador */}
          <div style={{
            display: "flex", alignItems: "center", gap: "14px",
            margin: "32px 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(234,119,41,0.35))" }} />
            <div style={{ color: "rgba(234,119,41,0.65)", fontSize: "16px", lineHeight: 1 }}>◆</div>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(234,119,41,0.35), transparent)" }} />
          </div>

          <p className="sub-in" style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.8rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "44px",
          }}>
            Sistema de Gestión Notarial
          </p>

          {/* Botón INICIAR */}
          <Link href="/login" style={{ textDecoration: "none", display: "block" }}>
            <button className="btn-in btn-iniciar">
              INICIAR
            </button>
          </Link>

          {/* Línea decorativa inferior */}
          <div style={{
            width: "72px", height: "3px", margin: "40px auto 0",
            background: "linear-gradient(90deg, transparent, #ea7729, transparent)",
            borderRadius: "2px",
          }} />
        </div>

        {/* ── Esquinas decorativas ── */}
        {[
          { top: "18px", left:  "18px", borderTop: "2px solid rgba(234,119,41,0.28)", borderLeft:   "2px solid rgba(234,119,41,0.28)", borderRadius: "4px 0 0 0" },
          { top: "18px", right: "18px", borderTop: "2px solid rgba(234,119,41,0.28)", borderRight:  "2px solid rgba(234,119,41,0.28)", borderRadius: "0 4px 0 0" },
          { bottom: "18px", left:  "18px", borderBottom: "2px solid rgba(234,119,41,0.28)", borderLeft:  "2px solid rgba(234,119,41,0.28)", borderRadius: "0 0 0 4px" },
          { bottom: "18px", right: "18px", borderBottom: "2px solid rgba(234,119,41,0.28)", borderRight: "2px solid rgba(234,119,41,0.28)", borderRadius: "0 0 4px 0" },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: "56px", height: "56px",
            pointerEvents: "none", ...s,
          }} />
        ))}
      </div>
    </>
  );
}
