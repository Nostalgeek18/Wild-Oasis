import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";

export function useDeleteCabin() {

    const queryClient = useQueryClient();
    const { isLoading: isDeleting, mutate: deleteCabin } = useMutation({
      mutationFn: (id) => deleteCabinApi(id),
      onSuccess: () => {
          toast.success('Cabin successfully deleted');
          queryClient.invalidateQueries({
            queryKey: ["cabins"], //key of the query to invalidate (in CabinRow.jsx)
          })
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })

    return { isDeleting, deleteCabin }
}