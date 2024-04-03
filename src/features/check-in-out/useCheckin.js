import { useMutation } from "@tanstack/react-query"
import { updateBooking } from "../../services/apiBookings"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"

export function useChekin () {
    const queryClient = useQueryClient()
    const navigate = useNavigate()


    const {mutate: checkin, isLoading : isCheckinIn } = useMutation({
        mutationFn: ({bookingId, breakfast})=>updateBooking(bookingId, {
            status: 'checked-in',
            isPaid: true,
            ...breakfast
        }),

        onSuccess : (data) => {
            toast.success(`Booking #${data.id} successfully checked in`)
            queryClient.invalidateQueries({ active : true})
            navigate("/")
        },

        onError: () => toast.error("There was an error while checking in")
    })

    return { checkin, isCheckinIn}

}