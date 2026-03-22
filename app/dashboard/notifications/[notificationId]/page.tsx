import { getNotificationWithServiceDetails } from "@/app/dashboard/notifications/actions";
import { notFound } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  IndianRupee,
  AlertCircle,
  Package,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { MarkAsServicedButton } from "./mark-as-serviced-button";

export default async function NotificationDetailPage({
  params,
}: {
  params: Promise<{ notificationId: string }>;
}) {
  const { notificationId } = await params;
  const result = await getNotificationWithServiceDetails(notificationId);

  if ("error" in result) {
    notFound();
  }

  const { notification, type } = result;

  // Render Service Notification
  if (type === "service" && result.service) {
    const service = result.service;
    // Get the latest AMC contract
    const amc = service.amcContracts?.[0];
    const totalPaid =
      amc?.payments
        ?.filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0) || 0;

    return (
      <div className="space-y-6 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/dashboard/notifications"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Notifications
        </Link>

        {/* Notification Header */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {notification.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Service Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-indigo-600" />
              Service Information
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {service.customer.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {service.customer.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {service.customer.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Service Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Service Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Service Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {service.serviceType}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Installation Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(service.installationDate), "PPP")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Next Service Due</p>
                    <p className="text-sm font-semibold text-orange-600">
                      {format(new Date(service.nextServiceDueDate), "PPP")}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      (
                      {formatDistanceToNow(
                        new Date(service.nextServiceDueDate),
                        {
                          addSuffix: true,
                        },
                      )}
                      )
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {amc && (
              <>
                <div className="border-t border-gray-200"></div>

                {/* Contract Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    AMC Contract
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start space-x-3">
                      <IndianRupee className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Total Amount</p>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{amc.amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <IndianRupee className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Amount Paid</p>
                        <p className="text-sm font-medium text-green-600">
                          ₹{totalPaid.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <IndianRupee className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Balance Due</p>
                        <p className="text-sm font-medium text-orange-600">
                          ₹{(amc.amount - totalPaid).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <MarkAsServicedButton serviceId={service.id} />
          <Link
            href="/dashboard/notifications"
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    );
  }

  // Render Contract Notification
  if (type === "contract" && result.contract) {
    const contract = result.contract;
    const totalPaid =
      contract.payments
        ?.filter((p) => p.status === "PAID")
        .reduce((sum, p) => sum + p.amount, 0) || 0;

    return (
      <div className="space-y-6 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/dashboard/notifications"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Notifications
        </Link>

        {/* Notification Header */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-6 w-6 text-orange-600 mt-1" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {notification.title}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {formatDistanceToNow(new Date(notification.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Contract Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-600" />
              Contract Information
            </h2>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-medium text-gray-900">
                      {contract.customer.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {contract.customer.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 md:col-span-2">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {contract.customer.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Contract Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Contract Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <ShieldCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        contract.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : contract.status === "EXPIRED"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {contract.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Service Type</p>
                    <p className="text-sm font-medium text-gray-900">
                      {contract.service.serviceType}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Start Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(new Date(contract.startDate), "PPP")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Expires On</p>
                    <p className="text-sm font-semibold text-orange-600">
                      {format(new Date(contract.endDate), "PPP")}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      (
                      {formatDistanceToNow(new Date(contract.endDate), {
                        addSuffix: true,
                      })}
                      )
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Financial Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Financials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <IndianRupee className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Total Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{contract.amount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <IndianRupee className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Amount Paid</p>
                    <p className="text-sm font-medium text-green-600">
                      ₹{totalPaid.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <IndianRupee className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Balance Due</p>
                    <p className="text-sm font-medium text-orange-600">
                      ₹{(contract.amount - totalPaid).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/amcs/${contract.id}`}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
          >
            View Contract
          </Link>
          <Link
            href="/dashboard/notifications"
            className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </Link>
        </div>
      </div>
    );
  }

  // Fallback if neither matches (should theoretically not happen if result was successful)
  return (
    <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-200 m-8">
      <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900">
        Unknown Notification Type
      </h2>
      <p className="text-gray-500 mt-2">
        The notification content could not be displayed properly.
      </p>
      <Link
        href="/dashboard/notifications"
        className="mt-6 inline-block px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
      >
        Back to Notifications
      </Link>
    </div>
  );
}
