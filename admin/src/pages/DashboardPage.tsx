import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../components/DataTable";
import { MetricCard } from "../components/MetricCard";
import { adminCmsApi } from "../services/adminCmsApi";

export function DashboardPage() {
  const { data: dashboard } = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminCmsApi.getDashboard });
  const { data: products = [] } = useQuery({ queryKey: ["admin-products"], queryFn: adminCmsApi.listProducts });
  const { data: blogs = [] } = useQuery({ queryKey: ["admin-blogs"], queryFn: adminCmsApi.listBlogs });
  const metricsData = dashboard?.metrics ?? { products: 0, categories: 0, blogs: 0, enquiries: 0 };
  const metrics = [
    { label: "Products", value: String(metricsData.products), helper: "Managed catalogue items" },
    { label: "Enquiries", value: String(metricsData.enquiries), helper: "New enquiries" },
    { label: "Blogs", value: String(metricsData.blogs), helper: "CMS articles" },
    { label: "Categories", value: String(metricsData.categories), helper: "Catalogue groups" }
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard metric={metric} key={metric.label} />
        ))}
      </div>
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold">Recent updates</h2>
        <DataTable
          rows={[
            ...products.slice(0, 2).map((product) => ({
              id: product._id,
              title: product.name,
              status: product.active ? "active" as const : "inactive" as const,
              updatedAt: new Date(product.updatedAt).toLocaleDateString("en-IN")
            })),
            ...blogs.slice(0, 2).map((blog) => ({
              id: blog._id,
              title: blog.title,
              status: blog.status,
              updatedAt: new Date(blog.updatedAt).toLocaleDateString("en-IN")
            }))
          ]}
        />
      </div>
    </div>
  );
}
