"use client";

import Link from "next/link";
import Swal from "sweetalert2";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import apiClient from "@/utils/apiClient";
import { login } from "@/redux/authSlice";
import Label from "@/components/form/Label";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await apiClient.post("/login", {
        username,
        password,
      });
      const data = response.data;
      if (response.status === 200 && data.token) {
        dispatch(login({ token: data.token, role: data.role, username: data.username }));
        router.push("/profile");
      } else {
        Swal.fire({
          title: "Uğursuz cəhd",
          text: data.error || "İstifadəçi adı və ya parol yanlışdır.",
          icon: "error",
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Xəta baş verdi",
        text: "Serverlə əlaqə qurulmadı.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Plan Hesabat Informasiya Sistemi <br />
              Daxil Ol
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Daxil olmaq üçün istifadəçi adı və parolu daxil edin!
            </p>
          </div>
          <div>
            {/* Show image based on the current theme */}
            {/* {theme === "dark" ? (
              <img src="/images/dark-mode-image.jpg" alt="Dark Mode" className="w-full h-auto mb-5" />
            ) : (
              <img src="/images/light-mode-image.jpg" alt="Light Mode" className="w-full h-auto mb-5" />
            )} */}

            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    İstifadəçi adı <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    placeholder="İstifadəçi adı"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <Label>
                    Parol <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Parol"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm" type="submit">
                    Daxil Ol
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}