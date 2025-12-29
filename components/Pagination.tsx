"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalCount: number;
  pageSize: number;
  currentPage: number;
}

export default function Pagination({ totalCount, pageSize, currentPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`/shop?${params.toString()}`, { scroll: true });
  };

  return (
    <div className="flex items-center justify-center gap-2 py-10">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 flex items-center justify-center rounded-sm border border-[#E2E2FB] text-[#151875] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#FB2E86] transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => handlePageChange(pageNum)}
          className={`w-9 h-9 flex items-center justify-center rounded-sm font-josefin transition-all border ${
            currentPage === pageNum
              ? "bg-[#FB2E86] text-white border-[#FB2E86]"
              : "bg-white text-[#151875] border-[#E2E2FB] hover:border-[#FB2E86] hover:text-[#FB2E86]"
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-sm border border-[#E2E2FB] text-[#151875] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[#FB2E86] transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}