import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createEditBooking } from "../../services/apiBookings";
import { toast } from "react-hot-toast"

export function useEditBooking() {
    const queryClient = useQueryClient()

    const {mutate : editBookingMutation, isLoading: isEditing} = useMutation({
      mutationFn: ({newCabinBooking, id})=> createEditBooking(newCabinBooking, id),
      onSuccess: () => {
        toast.success("Booking successfully edited");
        queryClient.invalidateQueries({
          queryKey: ["bookings"]
        });
      },
      onError: (err) => toast.error(err.message)
    })
    
    return { isEditing, editBookingMutation }
}