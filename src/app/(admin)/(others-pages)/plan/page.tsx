import React from "react";
import { Metadata } from "next";
import Plan from "@/components/plan/plan";
import Calendar from "@/components/calendar/Calendar";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
    title: "Next.js Calender | TailAdmin - Next.js Dashboard Template",
    description:
        "This is Next.js Calender page for TailAdmin  Tailwind CSS Admin Dashboard Template",
    // other metadata
};
export default function page() {
    return (
        <>
            <PageBreadcrumb pageTitle="İş planı" />
            <Plan />
        </>
    );
}
