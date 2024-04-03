import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast";
import { deleteBooking as deleteBookingApi } from "../../services/apiBookings";

export function useDeleteBooking() {

    const queryClient = useQueryClient();
    const { isLoading: isDeleting, mutate: deleteBooking } = useMutation({
      mutationFn: (id) => deleteBookingApi(id),
      onSuccess: () => {
          toast.success('Booking successfully deleted');
          queryClient.invalidateQueries({
            queryKey: ["bookings"], //key of the query to invalidate (in CabinRow.jsx)
          })
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })

    return { isDeleting, deleteBooking }
}