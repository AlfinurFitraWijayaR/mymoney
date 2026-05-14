import { getCategories } from "@/lib/actions/categories";
import CategoriesClient from "./CategoriesClient";
import { requireAuth } from "@/lib/auth";

export const metadata = { title: "Categories – mymoney" };

export default async function CategoriesPage() {
  const session = await requireAuth();
  const categories = await getCategories();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="section-header">
        <div>
          <h1 className="page-title">Kategori</h1>
          <p className="text-surface-500 text-sm mt-0.5">
            {categories.length} kategori dikonfigurasi
          </p>
        </div>
      </div>

      <CategoriesClient categories={categories} role={session.role} />
    </div>
  );
}
