import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Avatar from "../../components/ui/avatar/Avatar";
import PageMeta from "../../components/common/PageMeta";

export default function Avatars() {
  return (
    <>
      <PageMeta
        title="React.js Avatars Dashboard | Mathsmastery Institute"
        description="This is React.js Avatars Dashboard page for Mathsmastery Institute"
      />
      <PageBreadcrumb pageTitle="Avatars" />
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Default Avatar">
          {/* Default Avatar (No Status) */}
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80" size="xsmall" />
            <Avatar src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80" size="small" />
            <Avatar src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80" size="medium" />
            <Avatar src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80" size="large" />
            <Avatar src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80" size="xlarge" />
            <Avatar src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80" size="xxlarge" />
          </div>
        </ComponentCard>
        <ComponentCard title="Avatar with online indicator">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="xsmall"
              status="online"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="small"
              status="online"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="medium"
              status="online"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="large"
              status="online"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="xlarge"
              status="online"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="xxlarge"
              status="online"
            />
          </div>
        </ComponentCard>
        <ComponentCard title="Avatar with Offline indicator">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="xsmall"
              status="offline"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="small"
              status="offline"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="medium"
              status="offline"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="large"
              status="offline"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="xlarge"
              status="offline"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="xxlarge"
              status="offline"
            />
          </div>
        </ComponentCard>{" "}
        <ComponentCard title="Avatar with busy indicator">
          <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="xsmall"
              status="busy"
            />
            <Avatar src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80" size="small" status="busy" />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="medium"
              status="busy"
            />
            <Avatar src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80" size="large" status="busy" />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="xlarge"
              status="busy"
            />
            <Avatar
              src="https://img.freepik.com/free-vector/woman-with-long-brown-hair-pink-shirt_90220-2940.jpg?semt=ais_hybrid&w=740&q=80"
              size="xxlarge"
              status="busy"
            />
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
