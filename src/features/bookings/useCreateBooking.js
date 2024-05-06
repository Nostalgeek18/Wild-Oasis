import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditBooking } from "../../services/apiBookings";

export function useCreateBooking(){
    const queryClient = useQueryClient();
    
    const {mutate : createBookingMutation, isLoading: isCreating} = useMutation({
      mutationFn: newBooking=> createEditBooking(newBooking),
      onSuccess: () => {
        toast.success("New booking successfully created");
        queryClient.invalidateQueries({
          queryKey: ["bookings"]
        });
      },
      onError: (err) => toast.error(err.message)
    })

    return {isCreating, createBookingMutation}
}