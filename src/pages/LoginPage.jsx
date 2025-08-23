// src/pages/LoginPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { ShoppingCart, Shield, Truck, Users, Wheat, Globe } from "lucide-react";

const ROLE_ROUTES = {
  farmer: "/farmer",
  buyer: "/buyer",
  equipmentSeller: "/equipment",
  consumer: "/consumer",
  // admin hidden from this page; separate route below
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { t, changeLanguage, languages, currentLanguage } = useLanguage();

  const roles = [
    {
      id: "farmer",
      label: t("farmer"),
      icon: Wheat,
      description: "Sell crops, rent equipment, access schemes",
      color: "bg-green-600 hover:bg-green-700",
      bgColor: "bg-green-50",
    },
    {
      id: "buyer",
      label: t("buyer"),
      icon: ShoppingCart,
      description: "Buy crops, participate in auctions",
      color: "bg-blue-600 hover:bg-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      id: "equipmentSeller",
      label: t("equipmentSeller"),
      icon: Truck,
      description: "Rent/sell agricultural equipment",
      color: "bg-orange-600 hover:bg-orange-700",
      bgColor: "bg-orange-50",
    },
    {
      id: "consumer",
      label: t("consumer"),
      icon: Users,
      description: "Explore crops, connect with farmers",
      color: "bg-teal-600 hover:bg-teal-700",
      bgColor: "bg-teal-50",
    },
  ]; // 👆 Admin removed from public page

  const handleRoleClick = (roleId) => {
    // Navigate to auth page with the selected role
    navigate('/auth', { state: { role: roleId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">🌾 Agrastra</h1>
              <p className="text-green-100 text-lg">
                Empowering Farmers • Connecting Markets • Growing Together
              </p>
            </div>
            {/* Language Selector */}
            <div className="flex space-x-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    currentLanguage === lang.code
                      ? "bg-white text-green-700"
                      : "bg-green-500 hover:bg-green-400"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
            {t("selectRole")}
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Choose your role to access the appropriate dashboard
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.id}
                  className={`${role.bgColor} rounded-xl p-6 border-2 border-transparent hover:border-gray-200 transition-all cursor-pointer group`}
                  onClick={() => handleRoleClick(role.id)}
                >
                  <div className="text-center">
                    <div
                      className={`inline-flex p-4 rounded-full ${role.color} mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {role.label}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {role.description}
                    </p>
                    <button
                      className={`w-full py-2 px-4 rounded-lg text-white font-medium ${role.color} transition-colors`}
                    >
                      {t("login")} as {role.label}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Features */}
          <div className="bg-gray-50 px-8 py-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Wheat className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Fair Pricing</h4>
                <p className="text-sm text-gray-600">
                  MSP comparison & dynamic pricing
                </p>
              </div>
              <div>
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Direct Connect</h4>
                <p className="text-sm text-gray-600">
                  Farmers directly connect with buyers
                </p>
              </div>
              <div>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">
                  Secure Platform
                </h4>
                <p className="text-sm text-gray-600">
                  Government backed & verified
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
