import { getToday } from "../utils/helpers";
import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";
import { getCabin } from "./apiCabins";

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
// date : ISOstring
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }


  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("created_at");

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

export async function updateBooking(id, obj) {

  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

export async function getBookings({ filter, sortBy, page}) {
   let query =  supabase
   .from('bookings')
   .select(
    `id, created_at, startDate, endDate, numNights, numGuests, status, totalPrice,
     cabins(name),
     guests(fullName, email)`,
     { count : "exact" }
    )

    //FILTER
    if(filter) query = query[filter.method || "eq"](filter.
      field, filter.value);

    //SORT
    if(sortBy) {
      query = query.order(sortBy.field, {ascending : sortBy.direction === 'asc'})
    }

    if(page) {
      const from = (page-1) * PAGE_SIZE 
      const to = from + PAGE_SIZE -1
      query = query.range(from, to)
    }

    const { data, error, count } = await query;

    if(error) {
      console.error(error)
      throw new Error('Bookings could not be loaded')
  }

  return { data, count };
}

export async function createEditBooking(newBooking, id) {

  //Calculating total price
  newBooking.totalPrice = parseFloat(newBooking.cabinPrice) + parseFloat(newBooking.extrasPrice);

  // 1. Create cabin/edit cabin
  let query = supabase.from('bookings')

    // extra operations and validations
    try {
      const cabin = await getCabin(newBooking.cabinId)
      const {discount, maxCapacity, regularPrice } = cabin;
      //actual discount to consider from the TOTAL of nights
      const totalDiscount = discount * newBooking.numNights
  
      if(newBooking.numGuests > maxCapacity) {
        throw new Error(`Number of guests (${newBooking.numGuests}) exceeds the capacity of the cabin (${maxCapacity})`)
      }
  
  
  
      //Calculate cabinPrice from numNights x regularPrice of the cabin alone
      const cabinPrice = parseInt(newBooking.numNights) * parseFloat(regularPrice)
  
      //Add cabinPrice field to newBooking obj
      newBooking["cabinPrice"] = cabinPrice;
  
      //Calculate total price : cabinPrice + extras price - TotalDiscount
      const totalPrice = parseFloat(cabinPrice) + parseFloat(newBooking.extrasPrice) - parseFloat(totalDiscount);
  
      //add totalPrice field to newBooking obj
      newBooking["totalPrice"] = totalPrice
  
    }catch (error) {
      throw error
    }
    

  // A) Create
  if(!id){
      // extra operations and validations
      try {
        const cabin = await getCabin(newBooking.cabinId)
        const {discount, maxCapacity, regularPrice } = cabin;
        //actual discount to consider from the TOTAL of nights
        const totalDiscount = discount * newBooking.numNights
    
        if(newBooking.numGuests > maxCapacity) {
          throw new Error(`Number of guests (${newBooking.numGuests}) exceeds the capacity of the cabin (${maxCapacity})`)
        }
    
    
    
        //Calculate cabinPrice from numNights x regularPrice of the cabin alone
        const cabinPrice = parseInt(newBooking.numNights) * parseFloat(regularPrice)
    
        //Add cabinPrice field to newBooking obj
        newBooking["cabinPrice"] = cabinPrice;
    
        //Calculate total price : cabinPrice + extras price - TotalDiscount
        const totalPrice = parseFloat(cabinPrice) + parseFloat(newBooking.extrasPrice) - parseFloat(totalDiscount);
    
        //add totalPrice field to newBooking obj
        newBooking["totalPrice"] = totalPrice
    
      }catch (error) {
        throw error
      }

      newBooking.status = "unconfirmed"

      query = query
      .insert([
      {...newBooking},
      ])
      .select()
      .single();

  }
  
  // B) Edit (note there is no array inside the method)
  if(id) {
      query = query.update({... newBooking}).eq("id", id)
  }
  
  //will either create or edit
  const { data, error } = await query.select().single();

  if(error) {
      console.error(error)
      throw new Error('Booking could not be created')
  }

  return data;

}