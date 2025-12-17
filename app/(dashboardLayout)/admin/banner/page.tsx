import BannerTable from "@/components/Banner/BannerTable";
import CreateBannerForm from "@/components/Banner/CreateBanner";
import React from "react";

const BannerManagementPage = () => {
  return (
    <div className=" p-3 bg-white dark:bg-white/0">
      <BannerTable />
    </div>
  );
};

export default BannerManagementPage;
