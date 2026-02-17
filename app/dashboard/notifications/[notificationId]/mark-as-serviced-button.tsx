"use client";

import { useState } from "react";
import { markServiceAsServiced } from "@/app/dashboard/notifications/actions";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export function MarkAsServicedButton({ serviceId }: { serviceId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMarkAsServiced = async () => {
    if (!confirm("Are you sure you want to mark this service as completed?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await markServiceAsServiced(serviceId);

      if ("error" in result) {
        toast.error(result.error);
      } else {
        // Show different message based on service cycle
        if (result.serviceCycle === 3) {
          // 3rd service = end of 1-year contract
          toast.success("3rd service completed successfully!", {
            description: "1-year service contract completed",
            duration: 5000,
          });
        } else {
          // Show next service due date for 1st, 2nd, or 4th+ services
          const nextServiceDate = format(
            new Date(result.nextServiceDueDate),
            "PPP",
          );
          toast.success("Service completed successfully!", {
            description: `Next service due: ${nextServiceDate}`,
            duration: 5000,
          });
        }

        // Redirect after a brief delay to allow toast to be seen
        setTimeout(() => {
          router.push("/dashboard/notifications");
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to mark service as completed");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMarkAsServiced}
      disabled={loading}
      className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark Service as Complete
        </>
      )}
    </button>
  );
}
