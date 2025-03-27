import axios from 'axios'

const URL_API = "http://localhost:8080"

export const signUpAPI = async (accountData) =>{
    const res = await axios.post(`${URL_API}/api/accounts/create`,accountData)
    return res.data
}

export const loginAPI = async (accountData) =>{
    const res = await axios.post(`${URL_API}/api/accounts/login?email=${accountData.email}&&password=${accountData.password}`)
    return res.data
}

export const fetchUserInfoAPI = async (userId) =>{
    const res = await axios.get(`${URL_API}/api/accounts/${userId}`)
    return res.data
}

export const updateUserAPI = async (userId, updateData) => {
    const res = await axios.put(`${URL_API}/api/accounts/${userId}`, updateData)
    return res.data;
  };
  
  
  
export const validatePasswordAPI = async ({ id, oldPassword }) => {
    const res = await axios.post(`${URL_API}/api/accounts/validate-password?id=${id}&oldPassword=${oldPassword}`);
    return res.data;
  };
  
  //locations
  export const fetchAllLocationsAPI = async () =>{
    const res = await axios.get(`${URL_API}/api/Location`)
    return res.data
  }
//Categories
export const fetchAllCategories = async () =>{
  const res = await axios.get(`${URL_API}/api/Categories`)
  return res.data
}

//Hotels
export const fetchAllHotels = async () =>{
    const res = await axios.get(`${URL_API}/api/products`)
    return res.data
}

export const fetchOneHotels = async (HotelId) =>{
  const res = await axios.get(`${URL_API}/api/products/${HotelId}`)
  return res.data
}

//cart
export const fetchCartItemsAPI = async (accountId) =>{
  const res = await axios.get(`${URL_API}/api/cart/account/${accountId}`)
  return res.data
}
export const addToCartAPI = async (productId, accountId, checkInDate, checkOutDate) => {
  const response = await axios.post(
    `${URL_API}/api/cart/create`,
    null, // Không có body
    {
      params: {
        productId,
        accountId,
        checkInDate,
        checkOutDate,
      },
    }
  );
  return response.data;
};

export const updateCartItemAPI = async (cartItemId, checkInDate, checkOutDate) => {
  const response = await axios.put(
    `${URL_API}/api/cart/${cartItemId}`,
    null, // Không cần body
    {
      params: {
        checkInDate, // Định dạng đúng với API yêu cầu
        checkOutDate, // Định dạng đúng với API yêu cầu
      },
    }
  );
  return response.data;
};



export const deleteCartItemAPI = async (cartItemId) => {
      const response = await axios.delete(`${URL_API}/api/cart/${cartItemId}`);
      return response.data;
};
//order 
export const addToOrderAPI = async (orderData) => {
  
  const response = await axios.post(`${URL_API}/api/orders/create`,orderData);
  return response.data;

}
//VNPAY
export const paymentVNPAYAPI = async (orderData) => {
  
  const response = await axios.post(`${URL_API}/api/payment/create-payment`,orderData);
  return response.data;

}
export const bookingPaymentVNPAYAPI = async (orderData) => {
  
  const response = await axios.post(`${URL_API}/api/payment/create-flight-payment`,orderData);
  return response.data;

}
//MOMO
export const paymentMOMOAPI = async (amount) => {
  
  const response = await axios.post(`${URL_API}/api/payment/momo-payment?amount=${amount}`);
  return response.data;

}

//Airport
export const fetchAllToAirportAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/airports`);
  return response.data;

}
export const fetchAllPlaneAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/flights`);
  return response.data;

}
export const EditPlaneAPI = async (idPlane, dataPlane) => {
  
  const response = await axios.get(`${URL_API}/api/flights/${idPlane}`,dataPlane);
  return response.data;

}
export const fetchFlightByIdAPI = async (idPlane) => {
  
  const response = await axios.get(`${URL_API}/api/flights/${idPlane}`);
  return response.data;

}


export const CreateFlightAPI = async (DataFlight) => {
  
  const response = await axios.get(`${URL_API}/api/flights`,DataFlight);
  return response.data;

}
//SearchListFlight
export const SearchFlightAPI = async (dataSearchFlight) =>{
  const response = await axios.post(`${URL_API}/api/flights/search?departureAirportId=${dataSearchFlight.departureAirportId}&arrivalAirportId=${dataSearchFlight.arrivalAirportId}&departureDate=${dataSearchFlight.departureDate}&seatClass=${dataSearchFlight.seatClass}&passengerType=${dataSearchFlight.passengerType}`);
  return response.data;
}

//BookingPlane
export const bookingFlightAPI = async (dataBooking) =>{
  const response = await axios.post(`${URL_API}/api/bookings/create`,dataBooking);
  return response.data;
}

//Coze
export const sendMessageAPI = async (messageData) => {
  const response = await axios.post('http://localhost:8080/api/chat/message', messageData);
  return response.data;
}
//Province

export const createProvinceAPI = async (dataProvince) => {
  
  const response = await axios.post(`${URL_API}/api/Province/create`,dataProvince);
  return response.data;

}

export const fetchAllToProvinceAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/Province`);
  return response.data;

}
export const updateProvinceAPI = async (idProvince,dataUpdate) => {
  
  const response = await axios.put(`${URL_API}/api/Province/${idProvince}`,dataUpdate);
  return response.data;

}

export const fetchProvinceByIdAPI = async (idProvince) => {
  
  const response = await axios.get(`${URL_API}/api/Province/${idProvince}`);
  return response.data;

}
export const editToProvinceAPI = async (idProvince,dataUpdate) => {
  
  const response = await axios.get(`${URL_API}/api/Province/${idProvince}`,dataUpdate);
  return response.data;

}
export const deleteProvinceAPI = async (idProvince) => {
  
  const response = await axios.delete(`${URL_API}/api/Province/${idProvince}`);
  return response.data;

}

//District
export const createDistrictAPI = async (dataDistrict) => {
  
  const response = await axios.post(`${URL_API}/api/District/create`,dataDistrict);
  return response.data;

}
export const fetchAllToDistrictAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/District`);
  return response.data;

}
export const updateDistrictAPI = async (idDistrict,dataUpdate) => {
  
  const response = await axios.put(`${URL_API}/api/District/${idDistrict}`,dataUpdate);
  return response.data;

}
export const deleteDistrictAPI = async (idDistrict) => {
  
  const response = await axios.delete(`${URL_API}/api/District/${idDistrict}`);
  return response.data;

}

//Location
export const createLocationAPI = async (dataLocation) => {
  
  const response = await axios.post(`${URL_API}/api/Location/create`,dataLocation);
  return response.data;

}
export const fetchAllToLocationAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/Location`);
  return response.data;

}
export const updateLocationAPI = async (idLocation,dataUpdate) => {
  
  const response = await axios.put(`${URL_API}/api/Location/${idLocation}`,dataUpdate);
  return response.data;

}

export const deleteLocationAPI = async (idLocation) => {
  
  const response = await axios.delete(`${URL_API}/api/Location/${idLocation}`);
  return response.data;

}
//Alines
export const createAirlinesAPI = async (dataAirlines) => {
  
  const response = await axios.post(`${URL_API}/api/airlines`,dataAirlines);
  return response.data;

}
export const fetchAllToAirlinesAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/airlines`);
  return response.data;

}
export const updateAirlinesAPI = async (idAirlines,dataUpdate) => {
  
  const response = await axios.put(`${URL_API}/api/airlines/${idAirlines}`,dataUpdate);
  return response.data;

}
export const deleteAirlinesAPI = async (idAirlines) => {
  
  const response = await axios.delete(`${URL_API}/api/airlines/${idAirlines}`);
  return response.data;

}
//Airport
export const createAirportAPI = async (dataAirport) => {
  
  const response = await axios.post(`${URL_API}/api/airports`,dataAirport);
  return response.data;

}
export const updateAirportAPI = async (idAirport,dataUpdate) => {
  
  const response = await axios.put(`${URL_API}/api/airports/${idAirport}`,dataUpdate);
  return response.data;

}
export const deleteAirportAPI = async (idAirport) => {
  
  const response = await axios.delete(`${URL_API}/api/airports/${idAirport}`);
  return response.data;

}
//Flight
export const createFlightAPI = async (dataFlight) => {
  
  const response = await axios.post(`${URL_API}/api/flights`,dataFlight);
  return response.data;

}
export const updateFlightAPI = async (idFlight,dataUpdate) => {
  
  const response = await axios.put(`${URL_API}/api/flights/${idFlight}`,dataUpdate);
  return response.data;

}
export const deleteFlightAPI = async (idFlight) => {
      
  const response = await axios.delete(`${URL_API}/api/flights/${idFlight}`);
  return response.data;

}

export const fetchAllToFlightAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/flights`);
  return response.data;

}


//Seat
export const createSeatAPI = async (dataSeat) => {
  
  const response = await axios.post(`${URL_API}/api/seats`,dataSeat);
  return response.data;

}
export const updateSeatAPI = async (idSeat,dataUpdate) => {
  
  const response = await axios.put(`${URL_API}/api/seats/${idSeat}`,dataUpdate);
  return response.data;

}
export const deleteSeatAPI = async (idSeat) => {
  
  const response = await axios.delete(`${URL_API}/api/seats/${idSeat}`);
  return response.data;

}
export const fetchAllToSeatAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/seats`);
  return response.data;

}
//Booking
export const createBookingAPI = async (dataBooking) => {
  
  const response = await axios.post(`${URL_API}/api/bookings`,dataBooking);
  return response.data;

}
//Category
export const createCategoryAPI = async (dataCategory) => {
  
  const response = await axios.post(`${URL_API}/api/categories`,dataCategory);
  return response.data;

}
export const updateCategoryAPI = async (idCategory,dataUpdate) => {
  
  const response = await axios.put(`${URL_API}/api/categories/${idCategory}`,dataUpdate);
  return response.data;

}
export const deleteCategoryAPI = async (idCategory) => {
  
  const response = await axios.delete(`${URL_API}/api/categories/${idCategory}`);
  return response.data;

}
export const fetchAllCategoriesAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/categories`);
  return response.data;

}
//Product
export const createProductAPI = async (dataProduct) => {
  
  const response = await axios.post(`${URL_API}/api/products`,dataProduct);
  return response.data;

}
export const updateProductAPI = async (idProduct,dataUpdate) => {
  
  const response = await axios.put(`${URL_API}/api/products/${idProduct}`,dataUpdate);
  return response.data;

}
export const deleteProductAPI = async (idProduct) => {
  
  const response = await axios.delete(`${URL_API}/api/products/${idProduct}`);
  return response.data;

}
export const fetchAllProductsAPI = async () => {
  
  const response = await axios.get(`${URL_API}/api/products`);
  return response.data;

}

export const fetchAllOrdersCustomerAPI = async (accountId) => {
  
  const response = await axios.get(`${URL_API}/api/orders/customer/${accountId}`);
  return response.data;

}

//Doanh thu 

export const fetchAllTotal = async () => {
  
  const response = await axios.get(`${URL_API}/api/orders/revenue`);
  return response.data;

}
export const fetchAllProduct = async () => {
  
  const response = await axios.get(`${URL_API}/api/products/total`);
  return response.data;

}
export const fetchAllFlight = async () => {
  
  const response = await axios.get(`${URL_API}/api/flights/total`);
  return response.data;

}
export const fetchAllUser = async () => {
  
  const response = await axios.get(`${URL_API}/api/accounts/total`);
  return response.data;

}