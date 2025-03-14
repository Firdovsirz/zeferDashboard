"use client";

import Swal from "sweetalert2";
import Label from "../form/Label";
import emailjs from 'emailjs-com';
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import apiClient from "@/utils/apiClient";
import Input from "../form/input/InputField";
import { useModal } from "../../hooks/useModal";
import React, { ChangeEvent, useEffect, useState } from "react";

interface UserDetails {
  ad: string;
  soyad: string;
  ata_adi: string;
  vezife_adi: string;
  fakulte_adi: string;
  kafedra_adi: string;
  email: string;
  tel_nomresi: string;
}

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const username = useSelector((state: RootState) => state.auth.username);
  const token = useSelector((state: RootState) => state.auth.token);
  const [problem, setProblem] = useState<string | undefined>('');
  const [sending, setSending] = useState(false);

  const handleProblem = (event: ChangeEvent<HTMLInputElement>) => {
    setProblem(event.target.value);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await apiClient.get(`/fetch_user_details/${username}`);
        if (response.status >= 200 && response.status < 300) {
          setUserDetails(response.data[0]);
        } else {
          console.error(`Error: Received status code ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, [username]);

  const handleSendEmail = async () => {
    if (!problem) {
      alert("Problem is required!");
      return;
    }

    if (!userDetails) {
      alert("User details are missing!");
      return;
    }

    setSending(true);

    const serviceID = 'service_mqazw6r';
    const templateID = 'template_z14h28r';
    const userID = '1Ca1cCpVHJaSepDhL';

    const templateParams = {
      to_email: 'firdovsirz@gmail.com',
      subject: `${userDetails.ad} ${userDetails.soyad}`,
      problem_description: problem,
      ad: `${userDetails.ad}`,
      soyad: `${userDetails.soyad}`,
      email: userDetails.email,
      vezife_adi: userDetails.vezife_adi
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, userID);
      Swal.fire('Texniki problem uğurla çatdırıldı!', '', 'success');
    } catch (error) {
      Swal.fire('Problem baş verdi!', '', 'error');
    } finally {
      setSending(false);
      closeModal();
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-2">Texniki dəstək</h1>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-5">Problemi bildirin</h2>
      </div>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Əlaqə
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Texniki problemi
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Problemi izah edin!
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-2">
                  Problem
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-2">
                    <Label>Problem</Label>
                    <Input
                      type="text"
                      defaultValue="https://www.facebook.com/PimjoHQ"
                      onChange={handleProblem}
                      value={problem}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-2">
                  Şəxsi məlumat
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Ad</Label>
                    <Input type="text" defaultValue="Musharof" value={userDetails?.ad} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Soyad</Label>
                    <Input type="text" defaultValue="Chowdhury" value={userDetails?.soyad} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>E-poçt</Label>
                    <Input type="text" defaultValue="randomuser@pimjo.com" value={userDetails?.email} disabled />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Əlaqə nömrəsi</Label>
                    <Input type="text" defaultValue="+09 363 398 46" value={userDetails?.tel_nomresi} disabled />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Bağla
              </Button>
              <Button size="sm" onClick={handleSendEmail} disabled={sending}>
                {sending ? "Göndərilir..." : "Göndər"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}