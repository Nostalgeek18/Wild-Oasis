import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function useLogin() {

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate : login, isLoading : isLoggin } = useMutation({
        mutationFn: ({email, password}) => loginApi({
        email, password}),
        onSuccess: (user) => 
        {
            queryClient.setQueryData(['user'], user.user)
            navigate("/dashboard", { replace : true }) //will 'delete' the prev page from navigation history
        },
        onError: err=> {
            console.log('ERROR', err)
            toast.error('Provided email or password are incorrect')
        }
    })

    return { login, isLoggin }
}