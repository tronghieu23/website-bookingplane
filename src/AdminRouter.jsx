import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./view/admin/Dashboard";
import ManageFlights from "./view/admin/FlightManager";
import EditFlight from "./view/admin/FlightManager/edit";
import AdminLayout from "./view/admin/AdminAppBar";
import ManageProvinces from "./view/admin/ProvinceManager";
import EditProvincePage from "./view/admin/ProvinceManager/edit";
import CreateProvince from "./view/admin/ProvinceManager/create";
import DistrictCreate from "./view/admin/DistrictManager/create";
import ManageDistricts from "./view/admin/DistrictManager";
import EditDistrict from "./view/admin/DistrictManager/edit";
import LocationCreate from "./view/admin/LocationManager/create";
import ManageLocations from "./view/admin/LocationManager";
import EditLocation from "./view/admin/LocationManager/edit";
import AirlineCreate from "./view/admin/AirlineManager/create";
import ManageAirlines from "./view/admin/AirlineManager";
import EditAirline from "./view/admin/AirlineManager/edit";
import AirPortCreate from "./view/admin/AirPortManager/create";
import ManageAirPorts from "./view/admin/AirPortManager";
import EditAirPort from "./view/admin/AirPortManager/edit";
import SeatCreate from "./view/admin/SeatManager/create";
import ManageSeats from "./view/admin/SeatManager";
import EditSeat from "./view/admin/SeatManager/edit";
import CreateFlight from "./view/admin/FlightManager/create";
import ProductCategoryCreate from "./view/admin/ProductCategoryManager/create";
import ManageProductCategories from "./view/admin/ProductCategoryManager";
import EditProductCategory from "./view/admin/ProductCategoryManager/edit";
import CreateProduct from "./view/admin/ProductManager/create";
import ManageProducts from "./view/admin/ProductManager";
import EditProduct from "./view/admin/ProductManager/edit";

const AdminRouter = () => {

  return (
    <Routes>
      {/* Route mặc định cho admin */}
      <Route path="/" element={<AdminLayout><AdminDashboard /></AdminLayout>} />

      //Route quản lý tỉnh thành
      <Route path="/create-province" element={<AdminLayout><CreateProvince /></AdminLayout>} />
      <Route path="/provinces" element={<AdminLayout><ManageProvinces /></AdminLayout>} />
      <Route path="/edit-province/:id" element={<AdminLayout><EditProvincePage /></AdminLayout>} />

      //Route quản lý quận huyện
      <Route path="/create-district" element={<AdminLayout><DistrictCreate /></AdminLayout>} />
      <Route path="/districts" element={<AdminLayout><ManageDistricts /></AdminLayout>} />
      <Route path="/edit-district/:id" element={<AdminLayout><EditDistrict /></AdminLayout>} />

      //Route quản lý địa điểm
      <Route path="/create-location" element={<AdminLayout><LocationCreate /></AdminLayout>} />
      <Route path="/locations" element={<AdminLayout><ManageLocations /></AdminLayout>} />
      <Route path="/edit-location/:id" element={<AdminLayout><EditLocation /></AdminLayout>} />

      //Route quản lý hãng hàng không
      <Route path="/create-airline" element={<AdminLayout><AirlineCreate /></AdminLayout>} />
      <Route path="/airlines" element={<AdminLayout><ManageAirlines /></AdminLayout>} />
      <Route path="/edit-airline/:id" element={<AdminLayout><EditAirline /></AdminLayout>} />
      
      //Route quản lý sân bay
      <Route path="/create-airport" element={<AdminLayout><AirPortCreate /></AdminLayout>} />
      <Route path="/airports" element={<AdminLayout><ManageAirPorts /></AdminLayout>} />
      <Route path="/edit-airport/:id" element={<AdminLayout><EditAirPort /></AdminLayout>} />
      
      //Route quản lý vé máy bay
      <Route path="/flights" element={<AdminLayout><ManageFlights /></AdminLayout>} />
      <Route path="/edit-flight/:id" element={<AdminLayout><EditFlight /></AdminLayout>} />
      <Route path="/create-flight" element={<AdminLayout><CreateFlight/></AdminLayout>} />

      //Route quản lý ghế máy bay
      <Route path="/seats" element={<AdminLayout><ManageSeats /></AdminLayout>} />
      <Route path="/create-seat" element={<AdminLayout><SeatCreate /></AdminLayout>} />
      <Route path="/edit-seat/:id" element={<AdminLayout><EditSeat /></AdminLayout>} />
      
      //Route quản lý danh mục sản phẩm
      <Route path="/create-product-category" element={<AdminLayout><ProductCategoryCreate /></AdminLayout>} />
      <Route path="/product-categories" element={<AdminLayout><ManageProductCategories /></AdminLayout>} />
      <Route path="/edit-product-category/:id" element={<AdminLayout><EditProductCategory /></AdminLayout>} />
      //Route quản lý sản phẩm
      <Route path="/create-product" element={<AdminLayout><CreateProduct /></AdminLayout>} />
      <Route path="/products" element={<AdminLayout><ManageProducts /></AdminLayout>} />
      <Route path="/edit-product/:id" element={<AdminLayout><EditProduct /></AdminLayout>} />
      
      {/* Redirect khi truy cập không hợp lệ */}
      <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
};

export default AdminRouter;
