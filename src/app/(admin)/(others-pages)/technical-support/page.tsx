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
import TechnicalSupport from "@/components/technical-support/TechnicalSupport";

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
        <>
            <TechnicalSupport />
        </>
    );
}
