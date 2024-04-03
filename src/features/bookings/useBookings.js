import { useQuery } from "@tanstack/react-query";
import { getBookings } from "../../services/apiBookings";
import { useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query"
import { PAGE_SIZE } from "../../utils/constants";

//import { getCookings } from "../../services/apiCabins";

export function useBookings() {

  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams();
  //FILTER
  const filterValue = searchParams.get("status");
  const filter = !filterValue || filterValue === 'all' ? null : {field : 'status', value: filterValue}

  //SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc";
  const [field, direction] = sortByRaw.split('-')
  const sortBy = { field, direction };

    //PAGINATION
    const page = !searchParams.get('page') 
    ? 1 
    : Number(searchParams.get('page'))
  
    //QUERY
    const {
        isLoading, 
        data: { data : bookings, count } = {}, 
        error
      } = useQuery({
        queryKey: ["bookings", filter, sortBy, page] /*Filter will be part of the key. Therefore, if the filter changes, the 
        query will change along the way and redo the calculation */,
        queryFn: ()=>getBookings({ filter, sortBy, page })
      })

      const pageCount = Math.ceil(count / PAGE_SIZE
      )
      //PRE-FETCHING
      if(page < pageCount)
      queryClient.prefetchQuery({
        queryKey: ["bookings", filter, sortBy, page+1] /*Filter will be part of the key. Therefore, if the filter changes, the 
        query will change along the way and redo the calculation */,
        queryFn: ()=>getBookings({ filter, sortBy, page: page+1 })
      })

      if(page > 1)
      queryClient.prefetchQuery({
        queryKey: ["bookings", filter, sortBy, page-1] /*Filter will be part of the key. Therefore, if the filter changes, the 
        query will change along the way and redo the calculation */,
        queryFn: ()=>getBookings({ filter, sortBy, page: page-1 })
      })
    
      return {isLoading, error, bookings, count}
}