import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PWFindReset() {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("location.state =", location.state);

  const email = location.state?.email;

  if (!email) {
    alert("email 없음 - 잘못된 접근");
    navigate("/login");
    return null;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>PW RESET</h2>
      <p>email: {email}</p>
    </div>
  );
}
