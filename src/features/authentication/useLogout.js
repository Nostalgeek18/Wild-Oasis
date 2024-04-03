import { useNavigate } from "react-router-dom"
import { logout as logoutApi } from "../../services/apiAuth"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useLogout() {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate: logout, isLoading } = useMutation({
        mutationFn : logoutApi,
        onSuccess: () => {
            queryClient.removeQueries(); //clean from the cache all the queries made
            navigate("/login", {replace : true}) //will 'delete' the prev page from navigation history
        }
    })

    return { logout, isLoading }
}