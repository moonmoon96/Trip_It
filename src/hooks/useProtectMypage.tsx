import React from "react";
import { useNavigate } from "react-router-dom";

const useProtectMypage = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  if (role !== "ROLE_USER" && role !== "ROLE_A") {
    navigate(-1);
  }

  return role;
};

export default useProtectMypage;
