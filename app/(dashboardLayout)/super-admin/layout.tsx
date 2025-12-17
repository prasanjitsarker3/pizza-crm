import CustomLayout from "@/components/DashboardCustom/CustomLayout";

const SuperAdminMainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <CustomLayout>{children}</CustomLayout>
    </div>
  );
};

export default SuperAdminMainLayout;
