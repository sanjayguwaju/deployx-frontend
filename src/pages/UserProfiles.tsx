import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs/Tabs";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="Profile | DeployX"
        description="User profile management"
      />
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        
        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="mb-6 w-full sm:w-auto">
            <TabsTrigger value="meta" className="w-full sm:w-auto">Overview</TabsTrigger>
            <TabsTrigger value="info" className="w-full sm:w-auto">Personal Info</TabsTrigger>
            <TabsTrigger value="address" className="w-full sm:w-auto">Address</TabsTrigger>
          </TabsList>
          
          <TabsContent value="meta" className="space-y-6">
            <UserMetaCard />
          </TabsContent>
          
          <TabsContent value="info" className="space-y-6">
            <UserInfoCard />
          </TabsContent>
          
          <TabsContent value="address" className="space-y-6">
            <UserAddressCard />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
