"use client";

import { Metadata } from "next";
import React, { useEffect } from "react";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { useDispatch, UseDispatch, useSelector } from "react-redux";
import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserPasswordRecover from "@/components/user-profile/UserPasswordRecover";

// export const metadata: Metadata = {
//   title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
// };

export default function Profile() {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!token) {
        router.push("/signin");
        return;
      }
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();
        if (currentTime >= expirationTime) {
          dispatch(logout());
          router.push("/signin");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        dispatch(logout());
        router.push("/signin");
      }
    };
    checkTokenExpiration();
  }, [token]);
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profil
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
          <UserPasswordRecover />
        </div>
      </div>
    </div>
  );
}
