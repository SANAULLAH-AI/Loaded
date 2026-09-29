import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import Feed from "@/components/feed/Feed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex pt-14">
        <Sidebar />
        <Feed />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
