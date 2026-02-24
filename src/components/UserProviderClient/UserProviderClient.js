// src/components/UserProviderClient.js
"use client";

import { UserContext } from "../../context/UserContext";

export default function UserProviderClient({ children, value }) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
