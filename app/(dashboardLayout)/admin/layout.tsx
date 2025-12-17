import CustomLayout from "@/components/DashboardCustom/CustomLayout";

const AdminMainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <CustomLayout>{children}</CustomLayout>
    </div>
  );
};

export default AdminMainLayout;
